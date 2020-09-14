import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../actions/api';
import { Store, ACTION_ENUM } from '../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../common/enums';
import { useParams } from 'react-router-dom';

export default function AddPhase(props) {
  const { t } = useTranslation();
  const { isOpen, onClose } = props;
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    const { phase } = values;
    const errors = {};
    if (phase.length > 64) {
      formik.setFieldValue('phase', phase.slice(0, 64));
    }
    if (!phase.length) {
      errors.phase = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      phase: '',
    },
    validate,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { phase } = values;
      const res = await api('/api/entity/phase', {
        method: 'POST',
        body: JSON.stringify({
          phase,
          eventId,
        }),
      });
      resetForm();
      if (res.status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 2000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('phase_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
      }
    },
  });

  const buttons = [
    {
      onClick: handleClose,
      name: t('finish'),
      color: 'grey',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'phase',
      id: 'phase',
      label: 'Phase',
      type: 'phase',
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('create_a_phase')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
