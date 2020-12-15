import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../common/enums';
import { useParams } from 'react-router-dom';

export default function AddField(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, addFieldToGrid } = props;
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    const { field } = values;
    const errors = {};
    if (!field.length) {
      errors.field = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (field.length > 64) {
      formik.setFieldValue('field', field.slice(0, 64));
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      field: '',
    },
    validate,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { field } = values;
      const { status, data } = await api('/api/entity/field', {
        method: 'POST',
        body: JSON.stringify({
          field,
          eventId,
        }),
      });

      resetForm();
      if (status === STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('field_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });

        // used in interactive tool
        if (addFieldToGrid) {
          addFieldToGrid(data);
        }
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

  const buttons = [
    {
      onClick: onFinish,
      name: t('finish'),
      color: 'default',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'field',
      id: 'field',
      type: 'text',
      label: t('field'),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('add_field')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
