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
import { formatRoute } from '../../../actions/goTo';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, phaseId, keepPhase } = props;
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(isOpen);
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    getPhases();
  }, [open, phaseId]);

  useEffect(() => {
    formik.setFieldValue('phase', phaseId);
  }, [phaseId, keepPhase]);

  const getPhases = async () => {
    const { data } = await api(
      formatRoute('/api/entity/phases', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.id,
      display: d.name,
    }));
    setPhases([{ value: 'none', display: t('none') }, ...res]);
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    const { phase, time } = values;
    const errors = {};
    if (!time.length) {
      errors.time = t(ERROR_ENUM.VALUE_IS_REQUIRED);
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
      time: '09:00',
      team1: '',
      team2: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { phase, field, time, team1, team2 } = values;
      let realPhaseId = phase;
      if (phase === 'none') {
        realPhaseId = null;
      }
      const realTime = new Date(`2020-01-01 ${time}`).getTime();
      const res = await api('/api/entity/game', {
        method: 'POST',
        body: JSON.stringify({
          phaseId: realPhaseId,
          field,
          time: realTime,
          team1,
          team2,
        }),
      });

      resetForm();
      keepPhase(phase);
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
      name: t('add_game'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      isSelect: true,
      options: phases,
      namespace: 'phase',
      label: 'Phase',
    },
    {
      namespace: 'field',
      id: 'field',
      label: t('field'),
      type: 'text',
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
      type: 'text',
    },
    {
      namespace: 'team2',
      id: 'team2',
      label: t('team_2'),
      type: 'text',
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
      onClose={onClose}
    />
  );
}
