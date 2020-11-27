import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import moment from 'moment';
import { formatPrice } from '../../../../utils/stringFormats';
import BasicFormDialog from '../BasicFormDialog';
import { ERROR_ENUM } from '../../../../../../common/errors';

export default function EditEventPaymentOption(props) {
  const { open, onClose, option, editOptionEvent } = props;
  const { t } = useTranslation();
  useEffect(() => {
    formik.setFieldValue(
      'openDate',
      moment(option.start_time).format('yyyy-MM-DD'),
    );
    formik.setFieldValue(
      'openTime',
      moment(option.start_time).format('HH:mm'),
    );
    formik.setFieldValue(
      'closeDate',
      moment(option.end_time).format('yyyy-MM-DD'),
    );
    formik.setFieldValue(
      'closeTime',
      moment(option.end_time).format('HH:mm'),
    );
  }, [open]);
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };
  const validate = values => {
    const { openDate, openTime, closeDate, closeTime } = values;
    const errors = {};
    if (!openDate.length) {
      errors.openDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!openTime.length) {
      errors.openTime = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!closeDate.length) {
      errors.closeDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (closeDate < openDate) {
      errors.closeDate = t(ERROR_ENUM.CLOSE_AFTER_OPEN);
    }
    if (closeDate === openDate && closeTime < openTime) {
      errors.closeTime = t(ERROR_ENUM.CLOSE_AFTER_OPEN);
    }
    if (!closeTime.length) {
      errors.closeTime = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      openDate: moment().format('YYYY-MM-DD'),
      openTime: '00:00',
      closeDate: '',
      closeTime: '23:59',
    },
    validate,
    validateOnChange: false,
    onSubmit: values => {
      editOptionEvent(values);
      onClose();
    },
  });
  const fields = [
    {
      namespace: 'openDate',
      label: t('registration_open_date'),
      type: 'date',
      initialValue: moment().format('YYYY-MM-DD'),
      shrink: true,
    },
    {
      namespace: 'openTime',
      label: t('registration_open_time'),
      type: 'time',
      initialValue: '00:00',
      shrink: true,
    },
    {
      namespace: 'closeDate',
      label: t('registration_close_date'),
      type: 'date',
      shrink: true,
    },
    {
      namespace: 'closeTime',
      label: t('registration_close_time'),
      type: 'time',
      initialValue: '23:59',
      shrink: true,
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
      name: t('edit'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('edit_payment_option')}
      description={
        `${option.name} | ${t('price_team')} ` +
        (option.team_price === 0
          ? t('free')
          : formatPrice(option.team_price)) +
        `, ${t('price_individual')} ` +
        (option.individual_price === 0
          ? t('free')
          : formatPrice(option.individual_price))
      }
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
