import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  COMPONENT_TYPE_ENUM,
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import { FormDialog } from '../../../components/Custom';
import { formatDate } from '../../../utils/stringFormats';
import { Store, ACTION_ENUM } from '../../../Store';
import moment from 'moment';
import api from '../../../actions/api';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const {
    eventId,
    isOpen,
    onClose,
    createCard,
    field,
    timeslot,
    teams,
    phases,
  } = props;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    const { phase, team1, team2 } = values;
    const errors = {};
    if (!phase.length) {
      errors.phase = t(ERROR_ENUM.VALUE_IS_REQUIRED);
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
      team1: '',
      team2: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { phase, team1, team2 } = values;

      const { status, data } = await api('/api/entity/game', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          phaseId: phase,
          fieldId: field.id,
          timeslotId: timeslot.id,
          rosterId1: team1,
          rosterId2: team2,
        }),
      });

      if (
        status === STATUS_ENUM.ERROR ||
        status === STATUS_ENUM.UNAUTHORIZED
      ) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
        return;
      }

      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('game_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });

      createCard(data.game);

      onFinish();
    },
  });

  const buttons = [
    {
      onClick: onFinish,
      name: t('cancel'),
      color: 'secondary',
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
      options: phases,
      namespace: 'phase',
      label: t('phase'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: teams,
      namespace: 'team1',
      label: t('team_1'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: teams,
      namespace: 'team2',
      label: t('team_2'),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('create_a_game')}
      description={`${field?.name}, ${formatDate(
        moment(timeslot?.date),
        'DD MMM HH:mm',
      )}`}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
