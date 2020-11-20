import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  REPORT_TYPE_ENUM,
} from '../../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { useQuery } from '../../../../hooks/queries';
import moment from 'moment';

export default function SalesReport(props) {
  const { open: openProps, onClose, handleCreated } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: entityId } = useQuery();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = values => {
    const { date } = values;
    const errors = {};
    if (!date) {
      errors.date = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      date: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      setIsSubmitting(true);
      const { date } = values;
      const res = await api(`/api/entity/report`, {
        method: 'POST',
        body: JSON.stringify({
          type: REPORT_TYPE_ENUM.SALES,
          organizationId: entityId,
          date,
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
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('report_created'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
        onClose();
        handleCreated();
      }
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    formik.setFieldValue('date', moment().format('YYYY-MM-DD'));
    setOpen(openProps);
  }, [openProps]);

  const fields = [
    {
      namespace: 'date',
      label: t('date'),
      type: 'date',
      shrink: true,
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
      disabled: isSubmitting,
    },
    {
      type: 'submit',
      name: t('create'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('choose_date')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
