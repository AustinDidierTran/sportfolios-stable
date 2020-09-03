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
import moment from 'moment';
import { formatDate } from '../../../utils/stringFormats';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, phaseId, keepPhase } = props;
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(isOpen);
  const [phases, setPhases] = useState([]);
  const [slots, setSlots] = useState([]);
  const [teams, setTeams] = useState([]);
  const [theFields, setFields] = useState([]);

  useEffect(() => {
    getPhases();
    getSlots();
    getTeams();
    getFields();
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
    setPhases([
      { value: 'none', display: t('none_feminine') },
      ...res,
    ]);
  };

  const getSlots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/slots', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.date,
      display: formatDate(moment(d.date), 'ddd DD MMM h:mm'),
    }));
    setSlots([
      { value: 'none', display: t('none_feminine') },
      ...res,
    ]);
  };

  const getTeams = async () => {
    const { data } = await api(
      formatRoute('/api/entity/teamsSchedule', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.name,
      display: d.name,
    }));
    setTeams([
      { value: 'none', display: t('none_feminine') },
      ...res,
    ]);
  };

  const getFields = async () => {
    const { data } = await api(
      formatRoute('/api/entity/fields', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.field,
      display: d.field,
    }));
    setFields([{ value: 'none', display: t('none') }, ...res]);
  };

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
    onSubmit: async (values, { resetForm }) => {
      const { phase, field, time, team1, team2 } = values;
      let realPhaseId = phase;
      let realTeam1 = team1;
      let realTeam2 = team1;
      let realTime = new Date(time).getTime();
      let realField = field;
      if (phase === 'none') {
        realPhaseId = null;
      }
      if (team1 === 'none') {
        realTeam1 = null;
      }
      if (team2 === 'none') {
        realTeam2 = null;
      }
      if (time === 'none') {
        realTime = null;
      }
      if (field === 'none') {
        realField = null;
      }
      const res = await api('/api/entity/game', {
        method: 'POST',
        body: JSON.stringify({
          phaseId: realPhaseId,
          field: realField,
          time: realTime,
          team1: realTeam1,
          team2: realTeam2,
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
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      isSelect: true,
      options: phases,
      namespace: 'phase',
      label: t('phase'),
    },
    {
      isSelect: true,
      namespace: 'field',
      label: t('field'),
      options: theFields,
    },
    {
      isSelect: true,
      namespace: 'time',
      label: t('time_slot'),
      options: slots,
    },
    {
      isSelect: true,
      options: teams,
      namespace: 'team1',
      label: t('team_1'),
    },
    {
      isSelect: true,
      options: teams,
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
