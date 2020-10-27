import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  COMPONENT_TYPE_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
} from '../../../../../../common/enums';
import { useParams } from 'react-router-dom';
import BasicFormDialog from '../BasicFormDialog';
import { formatRoute, goTo, ROUTES } from '../../../../actions/goTo';
import {
  formatDate,
  getMembershipName,
} from '../../../../utils/stringFormats';
import moment from 'moment';
import { getExpirationDate } from '../../../../utils/memberships';

export default function BecomeMember(props) {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [persons, setPersons] = useState(userInfo.persons);
  const [memberships, setMemberships] = useState([]);
  const [fullMemberships, setFullMemberships] = useState([]);

  useEffect(() => {
    setOpen(openProps);
    getPersons();
    getMemberships();
  }, [openProps]);

  const getPersons = async () => {
    const { data } = await api(
      formatRoute('/api/entity/primaryPerson', null, null),
    );
    formik.setFieldValue('person', data.id);
    const res = userInfo.persons.map(p => ({
      value: p.entity_id,
      display: `${p.name} ${p?.surname}`,
    }));
    setPersons(res);
  };

  const getMemberships = async () => {
    const { data } = await api(
      formatRoute('/api/entity/memberships', null, {
        id,
      }),
    );
    setFullMemberships(data);
    const memberships = data.map(d => ({
      value: d.id,
      display: formatMembership(d),
    }));
    setMemberships(memberships);
  };

  const formatMembership = membership => {
    const { length, fixed_date, membership_type, price } = membership;
    const name = getMembershipName(membership_type);
    if (length) {
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
        return `${t(name)} | ${price}$ (${t('one_year')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
        return `${t(name)} | ${price}$ (${t('six_month')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
        return `${t(name)} | ${price}$ (${t('one_month')})`;
      }
    }
    if (fixed_date) {
      return `${t(name)} | ${price}$ (${formatDate(
        moment(new Date(fixed_date)).set(
          'year',
          moment().get('year') + 1,
        ),
      )})`;
    }
    return null;
  };

  const handleClose = () => {
    formik.resetForm();
    update();
    onClose();
  };

  const validate = values => {
    const { type } = values;
    const errors = {};
    if (!type) {
      errors.type = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      person: '',
      type: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { person, type } = values;
      const membership = fullMemberships.find(m => m.id === type);
      const res = await api(`/api/entity/member`, {
        method: 'POST',
        body: JSON.stringify({
          membershipId: type,
          membershipType: membership.membership_type,
          organizationId: membership.entity_id,
          personId: person,
          expirationDate: getExpirationDate(
            membership.length,
            membership.fixed_date,
          ),
        }),
      });
      if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('membership_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
        goTo(ROUTES.cart);
        handleClose();
      }
    },
  });

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'person',
      label: t('person'),
      options: persons,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'type',
      label: t('type'),
      options: memberships,
    },
  ];

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('become_member')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
