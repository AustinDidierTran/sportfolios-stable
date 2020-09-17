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
  SPIRIT_CATEGORY_ENUM,
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
  const [total, setTotal] = useState(10);

  useEffect(() => {
    getOptions();
  }, [open]);

  const getOptions = async () => {
    const s = await getSlots(eventId);
    const t = await getTeams(eventId, { withoutAll: true });
    setSlots(s);
    setTeams(t);

    formik.setFieldValue('yourTeam', t[0].value);
    formik.setFieldValue('opposingTeam', t[1].value);

    const pastSlots = slots
      .filter(slot => moment(slot.value) > moment())
      .map(slot => moment(slot.value));
    const date = moment.min(pastSlots);

    const def = slots.filter(slot => {
      return moment(slot.value).isSame(date);
    });
    if (def[0]) {
      formik.setFieldValue('timeSlot', def[0].value);
    }
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
      rulesKnowledgeAndUse,
      foulsAndBodyContact,
      fairMindedness,
      positiveAttitudeAndSelfControl,
      communication,
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
    if (rulesKnowledgeAndUse < 0) {
      errors.rulesKnowledgeAndUse = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (foulsAndBodyContact < 0) {
      errors.foulsAndBodyContact = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (fairMindedness < 0) {
      errors.fairMindedness = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (positiveAttitudeAndSelfControl < 0) {
      errors.positiveAttitudeAndSelfControl = t(
        ERROR_ENUM.VALUE_IS_REQUIRED,
      );
    }
    if (communication < 0) {
      errors.communication = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    const total =
      rulesKnowledgeAndUse +
      foulsAndBodyContact +
      fairMindedness +
      positiveAttitudeAndSelfControl +
      communication;
    setTotal(total);
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      timeSlot: '',
      yourTeam: '',
      yourScore: 0,
      opposingTeam: '',
      opposingTeamScore: 0,
      rulesKnowledgeAndUse: 2,
      foulsAndBodyContact: 2,
      fairMindedness: 2,
      positiveAttitudeAndSelfControl: 2,
      communication: 2,
    },
    validate,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const {
        timeSlot,
        yourTeam,
        yourScore,
        opposingTeam,
        opposingTeamScore,
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
          opposingTeamSpirit: total,
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

  const spiritOptions = [
    { display: '0', value: 0 },
    { display: '1', value: 1 },
    { display: '2', value: 2 },
    { display: '3', value: 3 },
    { display: '4', value: 4 },
  ];

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
      defaultValue: t('spirit'),
      disabled: true,
    },
    {
      defaultValue: t('spirit_chart_ligue_mardi'),
      disabled: true,
      color: 'textSecondary',
      variant: 'body2',
    },
    {
      isSelect: true,
      namespace: 'rulesKnowledgeAndUse',
      label: `1. ${t(SPIRIT_CATEGORY_ENUM.RULES_KNOWLEDGE_AND_USE)}`,
      options: spiritOptions,
    },
    {
      isSelect: true,
      namespace: 'foulsAndBodyContact',
      label: `2. ${t(SPIRIT_CATEGORY_ENUM.FOULS_AND_BODY_CONTACT)}`,
      options: spiritOptions,
    },
    {
      isSelect: true,
      namespace: 'fairMindedness',
      label: `3. ${t(SPIRIT_CATEGORY_ENUM.FAIR_MINDEDNESS)}`,
      options: spiritOptions,
    },
    {
      isSelect: true,
      namespace: 'positiveAttitudeAndSelfControl',
      label: `4. ${t(
        SPIRIT_CATEGORY_ENUM.POSITIVE_ATTITUDE_AND_SELF_CONTROL,
      )}`,
      options: spiritOptions,
    },
    {
      isSelect: true,
      namespace: 'communication',
      label: `5. ${t(SPIRIT_CATEGORY_ENUM.COMMUNICATION)}`,
      options: spiritOptions,
    },
    {
      defaultValue: `${t('total')}: ${total}`,
      disabled: true,
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
