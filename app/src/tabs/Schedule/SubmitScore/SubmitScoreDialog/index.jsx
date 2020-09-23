import React, { useState, useContext, useEffect } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  SPIRIT_CATEGORY_ENUM,
  COMPONENT_TYPE_ENUM,
} from '../../../../../../common/enums';
import { useParams } from 'react-router-dom';
import { getSlots, getTeams } from '../../ScheduleFunctions';
import moment from 'moment';
import { formatRoute } from '../../../../actions/goTo';
import validator from 'validator';
import AddPlayer from './AddPlayer';

export default function SubmitScoreDialog(props) {
  const { open: openProps, onClose, game } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(false);
  const [addPlayer, setAddPlayer] = useState(false);
  const [slots, setSlots] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roster, setRoster] = useState([]);
  const [fullRoster, setFullRoster] = useState([]);
  const [total, setTotal] = useState(10);

  const onAddPlayer = () => {
    setAddPlayer(true);
  };

  const onAddPlayerClose = () => {
    setAddPlayer(false);
  };

  const updateRoster = player => {
    const newRoster = [...roster, player];
    setRoster(newRoster);
  };

  useEffect(() => {
    if (open) {
      getOptions();
    }
  }, [open]);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const getRoster = async rosterId => {
    const { data } = await api(
      formatRoute('/api/entity/getRoster', null, {
        rosterId,
      }),
    );
    if (data) {
      const fullRoster = data.map(d => ({
        value: d.id,
        display: d.name,
      }));
      setFullRoster(fullRoster);

      const roster = data.filter(d => !d.isSub).map(d => d.name);
      setRoster(roster);
    }
  };

  const getOptions = async () => {
    const s = await getSlots(eventId);
    setSlots(s);

    if (game) {
      const t = game.teams.map(t => ({
        display: t.name,
        value: t.roster_id,
      }));
      setTeams(t);
      formik.setFieldValue('yourTeam', game.teams[0].roster_id);
      formik.setFieldValue('opposingTeam', game.teams[1].roster_id);
      formik.setFieldValue('timeSlot', game.start_time);
    } else {
      const t = await getTeams(eventId, { withoutAll: true });
      setTeams(t);
      if (t[0]) {
        formik.setFieldValue('yourTeam', t[0].value);
      }
      if (t[1]) {
        formik.setFieldValue('opposingTeam', t[1].value);
      }

      const pastSlots = slots
        .filter(slot => moment(slot.value) < moment())
        .map(slot => moment(slot.value));
      const date = moment.max(pastSlots);

      const def = slots.filter(slot => {
        return moment(slot.value).isSame(date);
      });
      if (def[0]) {
        formik.setFieldValue('timeSlot', def[0].value);
      }
    }
  };

  const handleChange = value => {
    setRoster(value);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
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
      comments: '',
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
        comments,
      } = values;
      let yourTeamName = null;
      let yourTeamId = null;
      let opposingTeamName = null;
      let opposingTeamId = null;
      if (validator.isUUID(yourTeam)) {
        yourTeamId = yourTeam;
      } else {
        yourTeamName = yourTeam;
      }
      if (validator.isUUID(opposingTeam)) {
        opposingTeamId = opposingTeam;
      } else {
        opposingTeamName = opposingTeam;
      }
      const res = await api('/api/entity/suggestScore', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          startTime: timeSlot,
          yourTeamName,
          yourTeamId,
          yourScore,
          opposingTeamName,
          opposingTeamId,
          opposingTeamScore: opposingTeamScore,
          opposingTeamSpirit: total,
          players: JSON.stringify(
            fullRoster.filter(full => roster.includes(full.display)),
          ),
          comments,
          suggestedBy,
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

  useEffect(() => {
    if (formik.values.yourTeam) {
      getRoster(formik.values.yourTeam);
    }
  }, [formik.values.yourTeam]);

  useEffect(() => {
    const team = formik.values.yourTeam;
    if (team === formik.values.opposingTeam && teams.length) {
      const t = teams.filter(t => t.value != team);
      formik.setFieldValue('opposingTeam', t[0].value);
    }
  }, [formik.values.yourTeam]);

  useEffect(() => {
    const team = formik.values.opposingTeam;
    if (team === formik.values.yourTeam && teams.length) {
      const t = teams.filter(t => t.value != team);
      formik.setFieldValue('yourTeam', t[0].value);
    }
  }, [formik.values.opposingTeam]);

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
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'timeSlot',
      label: t('time_slot'),
      options: slots,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'yourTeam',
      label: t('your_team'),
      options: teams,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.MULTISELECT,
      namespace: 'roster',
      label: t('roster'),
      options: fullRoster.map(r => r.display),
      values: roster,
      onChange: handleChange,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.BUTTON,
      namespace: 'addPlayer',
      children: t('add_player'),
      endIcon: 'Add',
      onClick: onAddPlayer,
      variant: 'contained',
      color: 'primary',
    },
    {
      namespace: 'yourScore',
      label: t('your_score'),
      type: 'number',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
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
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'rulesKnowledgeAndUse',
      label: `1. ${t(SPIRIT_CATEGORY_ENUM.RULES_KNOWLEDGE_AND_USE)}`,
      options: spiritOptions,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'foulsAndBodyContact',
      label: `2. ${t(SPIRIT_CATEGORY_ENUM.FOULS_AND_BODY_CONTACT)}`,
      options: spiritOptions,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'fairMindedness',
      label: `3. ${t(SPIRIT_CATEGORY_ENUM.FAIR_MINDEDNESS)}`,
      options: spiritOptions,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'positiveAttitudeAndSelfControl',
      label: `4. ${t(
        SPIRIT_CATEGORY_ENUM.POSITIVE_ATTITUDE_AND_SELF_CONTROL,
      )}`,
      options: spiritOptions,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'communication',
      label: `5. ${t(SPIRIT_CATEGORY_ENUM.COMMUNICATION)}`,
      options: spiritOptions,
    },
    {
      defaultValue: `${t('total')}: ${total}`,
      disabled: true,
    },
    {
      namespace: 'comments',
      label: t('comments'),
      type: 'text',
    },
  ];

  return (
    <>
      <FormDialog
        open={open}
        title={t('submit_score')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={onClose}
      />
      <AddPlayer
        open={addPlayer}
        onClose={onAddPlayerClose}
        rosterId={formik.values.yourTeam}
        updateRoster={updateRoster}
      />
    </>
  );
}
