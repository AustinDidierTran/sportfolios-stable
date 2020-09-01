import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../actions/api';
import { Store, ACTION_ENUM } from '../../../Store';
import { SEVERITY_ENUM } from '../../../../../common/enums';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen } = props;
  const { dispatch } = useContext(Store);

  const [open, setOpen] = useState(open);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onCancel = () => {
    setOpen(false);
  };

  const validate = values => {
    const { phase, time } = values;
    const errors = {};
    if (!time.length) {
      errors.time = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (phase.length > 64) {
      errors.phase = t(ERROR_ENUM.VALUE_IS_TOO_LONG);
    }
    if (!phase.length) {
      errors.phase = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      phase: '',
      field: '',
      time: '',
      team1: '',
      team2: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { field, time, team1, team2 } = values;
      const realTime = new Date(`2020-01-01 ${time}`).getTime();
      await api('/api/entity/game', {
        method: 'POST',
        body: JSON.stringify({
          field,
          time: realTime,
          team1,
          team2,
        }),
      });
      resetForm();
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('game_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
    },
  });

  const buttons = [
    {
      onClick: onCancel,
      name: t('finish'),
      color: 'grey',
    },
    {
      type: 'submit',
      name: t('add_game'),
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
    {
      namespace: 'field',
      id: 'field',
      label: t('field'),
      type: 'field',
    },
    {
      namespace: 'time',
      id: 'time',
      type: 'time',
    },
    {
      namespace: 'team1',
      id: 'team1',
      label: t('team_1'),
      type: 'team1',
    },
    {
      namespace: 'team2',
      id: 'team2',
      label: t('team_2'),
      type: 'team2',
    },
  ];

  return (
    <FormDialog
      open={open}
      title={'Game 1'}
      description={t('create_a_game')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onCancel}
    />
  );
}
