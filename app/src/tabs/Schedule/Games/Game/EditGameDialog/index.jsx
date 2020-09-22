import React, { useState, useEffect } from 'react';

import { FormDialog } from '../../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import {
  STATUS_ENUM,
  SEVERITY_ENUM,
  COMPONENT_TYPE_ENUM,
} from '../../../../../../../common/enums';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../../common/errors';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../../../Store';
import { getGameOptions } from '../../../ScheduleFunctions';
import { useParams } from 'react-router-dom';
import validator from 'validator';

export default function EditGameDialog(props) {
  const { game, update, open, onClose } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [edit, setEdit] = useState(open);
  const [gameOptions, setGameOptions] = useState({});

  const getOptions = async () => {
    const res = await getGameOptions(eventId, t);
    setGameOptions(res);
  };

  useEffect(() => {
    getOptions();
  }, [edit]);

  useEffect(() => {
    setEdit(open);
  }, [open]);

  useEffect(() => {
    formik.setFieldValue('phase', game.phase_id);
    formik.setFieldValue('field', game.field);
    formik.setFieldValue('time', game.start_time);
    formik.setFieldValue('team1', game.teams[0].name);
    formik.setFieldValue('team2', game.teams[1].name);
  }, [game]);

  const closeEdit = () => {
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      phase: '',
      field: '',
      time: '',
      team1: '',
      team2: '',
    },
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
        method: 'PUT',
        body: JSON.stringify({
          gameId: game.id,
          phaseId: phase,
          field,
          time: realTime,
          rosterId1,
          rosterId2,
          name1,
          name2,
          teamId1: game.teams[0].id,
          teamId2: game.teams[1].id,
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
        update();
        onClose();
      }
    },
  });

  const buttons = [
    {
      onClick: closeEdit,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('done'),
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
    <>
      <FormDialog
        open={edit}
        onClose={closeEdit}
        title={t('edit_game')}
        fields={fields}
        formik={formik}
        buttons={buttons}
      ></FormDialog>
    </>
  );
}
