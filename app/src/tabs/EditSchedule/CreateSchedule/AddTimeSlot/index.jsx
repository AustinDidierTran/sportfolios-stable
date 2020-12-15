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
import moment from 'moment';

export default function AddTimeSlot(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, addTimeslotToGrid } = props;
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
    const { date, time } = values;
    const errors = {};
    if (!time.length) {
      errors.time = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!date.length) {
      errors.date = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      time: '09:00',
      date: moment().format('YYYY-MM-DD'),
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { date, time } = values;
      const realDate = new Date(`${date} ${time}`).getTime();
      const { status, data } = await api('/api/entity/timeSlots', {
        method: 'POST',
        body: JSON.stringify({
          date: realDate,
          eventId,
        }),
      });
      if (status === STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('time_slot_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });

        // used in interactive tool
        if (addTimeslotToGrid) {
          addTimeslotToGrid(data);
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
      namespace: 'date',
      id: 'date',
      type: 'date',
    },
    {
      namespace: 'time',
      id: 'time',
      type: 'time',
    },
  ];
  return (
    <FormDialog
      open={open}
      title={t('add_time_slot')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
