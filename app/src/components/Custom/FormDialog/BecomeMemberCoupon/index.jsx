import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  COMPONENT_TYPE_ENUM,
  GLOBAL_ENUM,
  STATUS_ENUM,
  TABS_ENUM,
} from '../../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatRoute, goTo, ROUTES } from '../../../../actions/goTo';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

export default function BecomeMemberCoupon(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { open: openProps, onClose, items } = props;
  const { metadata, token_id } = items;
  const { expirationDate, membershipType, organizationId } = metadata;
  const [persons, setPersons] = useState([]);
  const [open, setOpen] = useState(false);
  const [organization, setOrganization] = useState({});

  useEffect(() => {
    setOpen(openProps);
    getPersons();
  }, [openProps]);

  useEffect(() => {
    getOrganization();
  }, [organizationId]);

  const getOrganization = async () => {
    const { data } = await api(
      formatRoute('/api/entity', null, {
        id: organizationId,
      }),
    );
    setOrganization(data);
  };

  const getPersons = async () => {
    const { data } = await api(
      formatRoute('/api/user/ownedPersons', null, {
        type: GLOBAL_ENUM.PERSON,
      }),
    );
    //Permet de mettre la primary person comme 1er élément de la liste
    for (var i = 0; i < data.length; i++) {
      if (data[i].isPrimaryPerson) {
        data.unshift(data.splice(i, 1)[0]);
        break;
      }
    }
    const res = data.map(d => ({
      display: d.complete_name,
      value: d.id,
    }));
    setPersons(res);
    formik.setFieldValue('person', res[0].value);
  };

  const validate = values => {
    const { person } = values;
    const errors = {};
    if (!person) {
      errors.person = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      person: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { person } = values;
      const res = await api(`/api/entity/memberManually`, {
        method: 'POST',
        body: JSON.stringify({
          membershipType,
          organizationId,
          personId: person,
          expirationDate: new Date(expirationDate),
        }),
      });
      if (res.status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        await api(`/api/user/useToken`, {
          method: 'PUT',
          body: JSON.stringify({
            tokenId: token_id,
          }),
        });
        onClose();
        goTo(
          ROUTES.entity,
          { id: organizationId },
          { tab: TABS_ENUM.ABOUT },
        );
      }
    },
  });

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('become_member_of', {
        organizationName: organization?.basicInfos?.name || '',
        expirationDate: formatDate(moment(expirationDate)),
      }),
    },
    persons.length === 1
      ? {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primary: persons[0]?.display,
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.SELECT,
          namespace: 'person',
          label: t('person'),
          options: persons,
        },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('apply'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('member_coupon')}
      description={t('this_coupon_is_only_good_once')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
