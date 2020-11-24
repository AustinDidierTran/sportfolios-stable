import React, { useState, useContext, useEffect } from 'react';
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
import { getTeams } from '../../../../tabs/Schedule/ScheduleFunctions';
import moment from 'moment';
import { formatRoute } from '../../../../actions/goTo';
import { formatDate } from '../../../../utils/stringFormats';
import BasicFormDialog from '../BasicFormDialog';
import AddPlayer from './AddPlayer';
import validator from 'validator';

export default function SubmitScoreDialog(props) {
  const { open: openProps, onClose, game } = props;
  const { t } = useTranslation();
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(false);
  const [addPlayer, setAddPlayer] = useState(false);
  const [teams, setTeams] = useState([]);
  const [roster, setRoster] = useState([]);
  const [fullRoster, setFullRoster] = useState([]);
  const [total, setTotal] = useState(10);
  const [opposingTeam, setOpposingTeam] = useState({});

  const onAddPlayer = () => {
    setAddPlayer(true);
  };

  const onAddPlayerClose = () => {
    setAddPlayer(false);
  };
  const updateRoster = player => {
    let name = '';
    if (player.is_sub) {
      name = `${player.completeName || player.name} (${t('sub')})`;
    } else {
      name = player.completeName || player.name;
    }
    const newRoster = [...roster, name];
    setRoster(newRoster);
    const newFullRoster = [
      ...fullRoster,
      { display: name, value: player.person_id || player.id },
    ];
    setFullRoster(newFullRoster);
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
        withSub: true,
      }),
    );
    if (data) {
      const fullRoster = data.map(d => {
        if (d.isSub) {
          return {
            value: d.personId,
            display: `${d.name} (${t('sub')})`,
          };
        }
        return {
          value: d.personId,
          display: d.name,
        };
      });
      setFullRoster(fullRoster);

      const roster = data.filter(d => !d.isSub).map(d => d.name);
      setRoster(roster);
    }
  };

  const getOptions = async () => {
    if (game) {
      const t = game.teams.map(t => ({
        display: t.name,
        value: t.roster_id,
      }));
      setTeams(t);
      formik.setFieldValue('yourTeam', game.teams[0].roster_id);
      setOpposingTeam({
        rosterId: game.teams[1].roster_id,
        name: game.teams[1].name,
      });
    } else {
      const t = await getTeams(eventId, { withoutAll: true });
      setTeams(t);
      if (t[0]) {
        formik.setFieldValue('yourTeam', t[0].value);
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
      yourTeam,
      yourScore,
      opposingTeamScore,
      rulesKnowledgeAndUse,
      foulsAndBodyContact,
      fairMindedness,
      positiveAttitudeAndSelfControl,
      communication,
    } = values;
    const errors = {};
    if (!yourTeam.length) {
      errors.yourTeam = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (yourScore < 0) {
      errors.yourScore = t(ERROR_ENUM.VALUE_IS_REQUIRED);
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
    onSubmit: async values => {
      const {
        yourTeam,
        yourScore,
        opposingTeamScore,
        comments,
      } = values;
      let yourTeamName = null;
      let yourTeamId = null;

      const suggestedBy = userInfo.primaryPerson
        ? userInfo.primaryPerson.entity_id
        : null;

      if (validator.isUUID(yourTeam)) {
        yourTeamId = yourTeam;
      } else {
        yourTeamName = yourTeam;
      }
      const res = await api('/api/entity/suggestScore', {
        method: 'POST',
        body: JSON.stringify({
          gameId: game?.id,
          eventId,
          yourTeamName,
          yourTeamId,
          yourScore,
          opposingTeamName: opposingTeam.name,
          opposingTeamId: opposingTeam.rosterId,
          opposingTeamScore: opposingTeamScore,
          opposingTeamSpirit: total,
          players: JSON.stringify(
            fullRoster.filter(full => roster.includes(full.display)),
          ),
          comments,
          suggestedBy,
        }),
      });

      if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
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
        handleClose();
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
    if (team === opposingTeam.rosterId && teams.length && team) {
      const t = teams.filter(t => t.value != team);
      if (t.length) {
        setOpposingTeam({ rosterId: t[0].value, name: t[0].display });
      }
    }
  }, [formik.values.yourTeam]);

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
      defaultValue: formatDate(moment(game.start_time), 'DD MMM'),
      disabled: true,
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
      children: t('add_sub'),
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
      defaultValue: `${t('opposing_team')}: ${opposingTeam.name}`,
      disabled: true,
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
      <BasicFormDialog
        open={open}
        title={t('submit_score')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={handleClose}
      />
      <AddPlayer
        open={addPlayer}
        onClose={onAddPlayerClose}
        rosterId={formik.values.yourTeam}
        fullRoster={fullRoster}
        updateRoster={updateRoster}
      />
    </>
  );
}
