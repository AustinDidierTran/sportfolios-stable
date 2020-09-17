import React, { useState, useContext, useEffect } from 'react';
import { FormDialog, Button } from '../../../components/Custom';
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
import styles from './SubmitScore.module.css';
import { getSlots, getTeams } from '../ScheduleFunctions';
import moment from 'moment';

export default function SubmitScore() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getOptions();
  }, [open]);

  const getOptions = async () => {
    const s = await getSlots(eventId);
    const t = await getTeams(eventId, { withoutAll: true });
    setSlots(s);
    setTeams(t);

    const pastSlots = slots
      .filter(slot => moment(slot.value) > moment())
      .map(slot => moment(slot.value));
    const date = moment.min(pastSlots);

    const def = slots.filter(slot => {
      return moment(slot.value).isSame(date);
    });
    formik.setFieldValue('timeSlot', def[0].value);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const validate = values => {
    const {
      timeSlot,
      yourTeam,
      yourScore,
      opposingTeam,
      opposingTeamScore,
      opposingTeamSpirit,
    } = values;
    const errors = {};
    if (!timeSlot.length) {
      errors.timeSlot = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!yourTeam.length) {
      errors.yourTeam = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (yourScore < 0) {
      errors.yourScore = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!opposingTeam.length) {
      errors.opposingTeam = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (opposingTeamScore < 0) {
      errors.opposingTeamScore = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (opposingTeamSpirit < 0) {
      errors.opposingTeamSpirit = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      timeSlot: '',
      yourTeam: '',
      yourScore: 0,
      opposingTeam: '',
      opposingTeamScore: 0,
      opposingTeamSpirit: 0,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const {
        timeSlot,
        yourTeam,
        yourScore,
        opposingTeam,
        opposingTeamScore,
        opposingTeamSpirit,
      } = values;
      const res = await api('/api/entity/suggestScore', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          startTime: timeSlot,
          yourTeam,
          yourScore,
          opposingTeam,
          opposingTeamScore: opposingTeamScore,
          opposingTeamSpirit: opposingTeamSpirit,
        }),
      });

      resetForm();
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
          message: t('score_submitted'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        onClose();
      }
    },
  });
  const buttons = [
    {
      onClick: handleClose,
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
      isSelect: true,
      namespace: 'timeSlot',
      label: t('time_slot'),
      options: slots,
    },
    {
      isSelect: true,
      namespace: 'yourTeam',
      label: t('your_team'),
      options: teams,
    },
    {
      namespace: 'yourScore',
      label: t('your_score'),
      type: 'number',
    },
    {
      isSelect: true,
      namespace: 'opposingTeam',
      label: t('opposing_team'),
      options: teams,
    },
    {
      namespace: 'opposingTeamScore',
      label: t('opposing_team_score'),
      type: 'number',
    },
    {
      namespace: 'opposingTeamSpirit',
      label: t('opposing_team_spirit'),
      type: 'number',
    },
  ];

  return (
    <>
      <Button
        size="small"
        variant="contained"
        endIcon="ArrowUpward"
        style={{ margin: '8px' }}
        onClick={onOpen}
        className={styles.button}
      >
        {t('submit_score')}
      </Button>
      <FormDialog
        open={open}
        title={t('submit_score')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={onClose}
      />
    </>
  );
}
