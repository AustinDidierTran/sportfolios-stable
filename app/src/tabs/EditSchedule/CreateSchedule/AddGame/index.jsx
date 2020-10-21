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
  COMPONENT_TYPE_ENUM,
} from '../../../../../../common/enums';
import { useParams } from 'react-router-dom';
import { getFutureGameOptions } from '../../../Schedule/ScheduleFunctions';
import validator from 'validator';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, update } = props;
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(isOpen);
  const [gameOptions, setGameOptions] = useState({});

  const getOptions = async () => {
    const res = await getFutureGameOptions(eventId, {
      withoutAll: true,
    });
    setGameOptions(res);
  };

  useEffect(() => {
    getOptions();
  }, [open]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    const { phase, field, time, team1, team2 } = values;
    const errors = {};
    if (!time.length) {
      errors.time = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!phase.length) {
      errors.phase = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!field.length) {
      errors.field = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!team1.length) {
      errors.team1 = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!team2.length) {
      errors.team2 = t(ERROR_ENUM.VALUE_IS_REQUIRED);
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
    onSubmit: async values => {
      const { phase, field, time, team1, team2 } = values;
      let realTime = new Date(time).getTime();
      let rosterId1 = null;
      let rosterId2 = null;
      let name1 = null;
      let name2 = null;
      if (validator.isUUID(team1)) {
        rosterId1 = team1;
      } else {
        name1 = team1;
      }
      if (validator.isUUID(team2)) {
        rosterId2 = team2;
      } else {
        name2 = team2;
      }
      const res = await api('/api/entity/game', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          phaseId: phase,
          field,
          time: realTime,
          rosterId1,
          rosterId2,
          name1,
          name2,
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
          message: t('game_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        update();
      }
    },
  });

  const buttons = [
    {
      onClick: onFinish,
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
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: gameOptions.phases,
      namespace: 'phase',
      label: t('phase'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'field',
      label: t('field'),
      options: gameOptions.fields,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'time',
      label: t('time_slot'),
      options: gameOptions.timeSlots,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: gameOptions.teams,
      namespace: 'team1',
      label: t('team_1'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: gameOptions.teams,
      namespace: 'team2',
      label: t('team_2'),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('create_a_game')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
