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
  SELECT_ENUM,
} from '../../../../../common/enums';
import { useParams } from 'react-router-dom';
import { getGameOptions } from '../ScheduleFunctions';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen, onClose } = props;
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(isOpen);
  const [gameOptions, setGameOptions] = useState({});

  const getOptions = async () => {
    const res = await getGameOptions(eventId, t);
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
      let realPhaseId = phase;
      let realTeam1 = team1;
      let realTeam2 = team2;
      let realTime = new Date(time).getTime();
      let realField = field;
      if (phase === SELECT_ENUM.NONE) {
        realPhaseId = null;
      }
      if (team1 === SELECT_ENUM.NONE) {
        realTeam1 = null;
      }
      if (team2 === SELECT_ENUM.NONE) {
        realTeam2 = null;
      }
      if (time === SELECT_ENUM.NONE) {
        realTime = null;
      }
      if (field === SELECT_ENUM.NONE) {
        realField = null;
      }
      const res = await api('/api/entity/game', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          phaseId: realPhaseId,
          field: realField,
          time: realTime,
          team1: realTeam1,
          team2: realTeam2,
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
      isSelect: true,
      options: gameOptions.phases,
      namespace: 'phase',
      label: t('phase'),
    },
    {
      isSelect: true,
      namespace: 'field',
      label: t('field'),
      options: gameOptions.fields,
    },
    {
      isSelect: true,
      namespace: 'time',
      label: t('time_slot'),
      options: gameOptions.timeSlots,
    },
    {
      isSelect: true,
      options: gameOptions.teams,
      namespace: 'team1',
      label: t('team_1'),
    },
    {
      isSelect: true,
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
