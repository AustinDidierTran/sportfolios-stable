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
  MEMBERSHIP_TYPE_ENUM,
} from '../../../../../../common/enums';
import { useParams } from 'react-router-dom';
import BasicFormDialog from '../BasicFormDialog';
import moment from 'moment';

export default function AddMember(props) {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: entityId } = useParams();

  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState(null);

  const validate = values => {
    const { person, expirationDate } = values;
    const errors = {};
    if (!person) {
      errors.person = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!expirationDate) {
      errors.expirationDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      person: '',
      membership: '',
      expirationDate: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { person, membership, expirationDate } = values;
      const res = await api(`/api/entity/membership`, {
        method: 'POST',
        body: JSON.stringify({
          entityId,
          person,
          membership,
          expirationDate,
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
          message: t('member_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        handleClose();
      }
    },
  });

  useEffect(() => {
    setOpen(openProps);
    formik.setFieldValue(
      'membership',
      MEMBERSHIP_TYPE_ENUM.RECREATIONAL,
    );
    formik.setFieldValue('expirationDate', moment().add(1, 'year'));
  }, [openProps]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  useEffect(() => {
    setPerson(formik.values.person);
  }, [formik.values.person]);

  const onClick = person => {
    setPerson(person);
  };
  const personComponent = person
    ? {
        componentType: COMPONENT_TYPE_ENUM.PERSON_ITEM,
        person,
        secondary: t('player'),
        notClickable: true,
      }
    : { componentType: COMPONENT_TYPE_ENUM.EMPTY };

  const fields = [
    personComponent,
    {
      componentType: COMPONENT_TYPE_ENUM.PERSON_SEARCH_LIST,
      namespace: 'person',
      label: t('player'),
      onClick,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'membership',
      label: t('membership'),
      options: [
        {
          display: t('recreational'),
          value: MEMBERSHIP_TYPE_ENUM.RECREATIONAL,
        },
        {
          display: t('competitive'),
          value: MEMBERSHIP_TYPE_ENUM.COMPETITIVE,
        },
        {
          display: t('elite'),
          value: MEMBERSHIP_TYPE_ENUM.ELITE,
        },
        {
          display: t('junior'),
          value: MEMBERSHIP_TYPE_ENUM.JUNIOR,
        },
      ],
    },
    {
      namespace: 'expirationDate',
      label: t('expiration_date'),
      type: 'date',
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
      title={t('add_membership')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
