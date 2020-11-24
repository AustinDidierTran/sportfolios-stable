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
} from '../../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';

export default function CreateTaxRate(props) {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [open, setOpen] = useState(false);
  const [inclusive, setInclusive] = useState(true);

  const countDecimals = number => {
    if (Math.floor(number) === number) return 0;
    return number.toString().split('.')[1].length || 0;
  };

  const validate = values => {
    const { displayName, description, percentage } = values;
    const errors = {};
    if (!displayName.length) {
      errors.displayName = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!description) {
      errors.description = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!percentage) {
      errors.percentage = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (percentage >= 100) {
      errors.percentage = t('valid_percentage_values');
    }
    if (countDecimals(percentage) > 4) {
      errors.percentage = t('valid_percentage_values');
    }
    if (percentage < 0) {
      errors.percentage = t('valid_percentage_values');
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      displayName: '',
      description: '',
      percentage: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { displayName, description, percentage } = values;
      const res = await api(`/api/admin/taxRate`, {
        method: 'POST',
        body: JSON.stringify({
          displayName,
          description,
          percentage,
          inclusive,
        }),
      });
      if (res.status === STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('tax_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        update();
        handleClose();
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      }
    },
  });

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const handleClose = () => {
    formik.resetForm();
    setInclusive(true);
    onClose();
  };

  const onChange = () => {
    setInclusive(!inclusive);
  };

  const fields = [
    {
      namespace: 'displayName',
      label: t('display_name'),
    },
    {
      namespace: 'description',
      label: t('description'),
    },
    {
      namespace: 'percentage',
      label: t('percentage'),
      type: 'number',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
      name: 'isSub',
      label: t('inclusive'),
      checked: inclusive,
      onChange: onChange,
      color: 'primary',
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
      title={t('add_tax')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
