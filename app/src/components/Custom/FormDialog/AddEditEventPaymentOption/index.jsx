import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import moment from 'moment';
import BasicFormDialog from '../BasicFormDialog';
import { SEVERITY_ENUM } from '../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../Store';
import { formatPrice } from '../../../../utils/stringFormats';

export default function AddEditEventPaymentOption(props) {
  const {
    open,
    onClose,
    selectedOption,
    isEdit,
    addOptionToEvent,
    editOptionEvent,
    hasBankAccount,
  } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  useEffect(() => {
    if (isEdit) {
      formik.setFieldValue(
        'openDate',
        moment(selectedOption.start_time).format('yyyy-MM-DD'),
      );
      formik.setFieldValue(
        'openTime',
        moment(selectedOption.start_time).format('HH:mm'),
      );
      formik.setFieldValue(
        'closeDate',
        moment(selectedOption.end_time).format('yyyy-MM-DD'),
      );
      formik.setFieldValue(
        'closeTime',
        moment(selectedOption.end_time).format('HH:mm'),
      );
    }
  }, [open]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    const {
      name,
      teamPrice,
      playerPrice,
      openDate,
      openTime,
      closeDate,
      closeTime,
    } = values;
    const errors = {};
    if (!isEdit) {
      if (!name) {
        errors.name = t(ERROR_ENUM.VALUE_IS_REQUIRED);
      }
      if (!teamPrice && teamPrice !== 0) {
        errors.teamPrice = t(ERROR_ENUM.VALUE_IS_REQUIRED);
      }
      if (teamPrice > 0 && !hasBankAccount) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('no_bank_account_linked'),
          severity: SEVERITY_ENUM.ERROR,
        });
        errors.teamPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
      }
      if (teamPrice < 0) {
        errors.teamPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
      }
      if (!playerPrice && playerPrice !== 0) {
        errors.playerPrice = t(ERROR_ENUM.VALUE_IS_REQUIRED);
      }
      if (playerPrice > 0 && !hasBankAccount) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('no_bank_account_linked'),
          severity: SEVERITY_ENUM.ERROR,
        });
        errors.playerPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
      }
      if (playerPrice < 0) {
        errors.playerPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
      }
    }
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
      name: '',
      teamPrice: '',
      playerPrice: '',
      openDate: moment().format('YYYY-MM-DD'),
      openTime: '00:00',
      closeDate: '',
      closeTime: '23:59',
    },
    validate,
    validateOnChange: false,
    onSubmit: values => {
      if (isEdit) {
        editOptionEvent(values);
      } else {
        addOptionToEvent(values);
      }
      onClose();
    },
  });

  const nonEditableFields = [
    {
      namespace: 'name',
      label: t('name'),
      type: 'text',
    },
    {
      namespace: 'teamPrice',
      label: t('price_team'),
      type: 'number',
      initialValue: 0,
      endAdorment: '$',
    },
    {
      namespace: 'playerPrice',
      label: t('price_individual'),
      type: 'number',
      initialValue: 0,
      endAdorment: '$',
    },
  ];

  const editableFields = [
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
      name: isEdit ? t('edit') : t('add'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={isEdit ? t('edit_payment_option') : t('payment_option')}
      description={
        isEdit
          ? `${selectedOption.name} | ${t('price_team')} ` +
            (selectedOption.team_price === 0
              ? t('free')
              : formatPrice(selectedOption.team_price)) +
            `, ${t('price_individual')} ` +
            (selectedOption.individual_price === 0
              ? t('free')
              : formatPrice(selectedOption.individual_price))
          : `(${t('for_free_option')})`
      }
      buttons={buttons}
      fields={
        isEdit
          ? editableFields
          : nonEditableFields.concat(editableFields)
      }
      formik={formik}
      onClose={handleClose}
    />
  );
}
