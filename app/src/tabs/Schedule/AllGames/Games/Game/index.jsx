import React, {
  useEffect,
  useMemo,
  useContext,
  useState,
} from 'react';

import { Card, FormDialog } from '../../../../../components/Custom';
import {
  CARD_TYPE_ENUM,
  COMPONENT_TYPE_ENUM,
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../../common/enums';
import SubmitScoreDialog from '../../../../../components/Custom/FormDialog/SubmitScoreSpiritForm';
import { ACTION_ENUM, Store } from '../../../../../Store';
import api from '../../../../../actions/api';
import { formatRoute } from '../../../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

export default function Game(props) {
  const { game, isPastGame } = props;
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);
  const { t } = useTranslation();

  const [
    selectedSubmissionerInfos,
    setSelectedSubmissionerInfos,
  ] = useState({});
  const [submitScore, setSubmitScore] = useState(false);
  const [
    possibleSubmissionersInfos,
    setpossibleSubmissionersInfos,
  ] = useState([]);

  const closeSubmitScore = () => {
    setSubmitScore(false);
  };

  const openSubmitScore = async () => {
    const { status, data } = await api(
      formatRoute('/api/entity/getPossibleSubmissionerInfos', null, {
        gameId: game.id,
        teamsIds: JSON.stringify(
          game.teams.map(t => ({
            rosterId: t.roster_id,
            name: t.name,
          })),
        ),
      }),
      { method: 'GET' },
    );

    if (status === STATUS_ENUM.FORBIDDEN) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you_are_not_in_any_of_these_teans'),
        severity: SEVERITY_ENUM.INFO,
      });
    } else if (data) {
      setpossibleSubmissionersInfos(data);
      // Only one choice of team and person to submit
      if (data.length === 1 && data[0].myAdminPersons.length === 1) {
        setSelectedSubmissionerInfos({
          myTeam: data[0].myTeam,
          enemyTeam: data[0].enemyTeam,
          person: data[0].myAdminPersons[0],
        });
        setSubmitScore(true);
      } else {
        // open choose submitter dialog
        setChooseSubmitter(true);
      }
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('invalid_roster_role_to_submit_score'),
        severity: SEVERITY_ENUM.INFO,
      });
    }
  };

  const [chooseSubmitter, setChooseSubmitter] = useState(false);
  const [possibleTeams, setPossibleTeams] = useState([]);
  const [possibleSubmissioners, setPossibleSubmissioners] = useState(
    [],
  );

  useEffect(() => {
    if (possibleSubmissionersInfos.length) {
      setPossibleTeams(
        possibleSubmissionersInfos.map(s => ({
          rosterId: s.myTeam.rosterId,
          name: s.myTeam.name,
        })),
      );

      setPossibleSubmissioners(
        possibleSubmissionersInfos.map(s => ({
          persons: s.myAdminPersons,
        })),
      );
    }
  }, [possibleSubmissionersInfos]);

  useEffect(() => {
    if (possibleTeams.length) {
      formik.setFieldValue('team', possibleTeams[0].rosterId);
    }
  }, [possibleTeams]);

  useEffect(() => {
    if (
      possibleSubmissioners.length === 1 &&
      possibleSubmissioners[0].length === 1
    ) {
      formik.setFieldValue('person', possibleSubmissioners[0][0]);
    }
  }, [possibleSubmissioners]);

  const formik = useFormik({
    initialValues: {
      team: '',
      person: '',
    },
    onSubmit: async values => {
      const { team, person } = values;

      const choice = possibleSubmissionersInfos.find(
        s => s.myTeam.rosterId === team,
      );
      setSelectedSubmissionerInfos({
        myTeam: choice.myTeam,
        enemyTeam: choice.enemyTeam,
        person: choice.myAdminPersons.find(
          p => p.entityId === person,
        ),
      });

      setSubmitScore(true);
      handleChooseSubmitterClose();
    },
  });

  const handleChooseSubmitterClose = () => {
    setChooseSubmitter(false);
    formik.resetForm();
  };

  const optionsTeam = useMemo(
    () =>
      possibleTeams.map(t => {
        return {
          value: t.rosterId,
          display: t.name,
        };
      }),
    [possibleTeams],
  );

  const optionsPerson = useMemo(() => {
    if (formik.values.team) {
      const options = possibleSubmissionersInfos
        .find(p => p.myTeam.rosterId === formik.values.team)
        .myAdminPersons.map(p => {
          return {
            value: p.entityId,
            display: p.completeName,
          };
        });
      if (
        options.some(
          o => o.value === userInfo.primaryPerson.entity_id,
        )
      ) {
        formik.setFieldValue(
          'person',
          userInfo.primaryPerson.entity_id,
        );
      } else {
        formik.setFieldValue('person', options[0].value);
      }
      return options;
    } else {
      [];
    }
  }, [formik.values.team]);

  const disableTeamSelect = useMemo(() => optionsTeam?.length === 1, [
    optionsTeam,
  ]);
  const disablePersonSelect = useMemo(
    () => optionsPerson?.length === 1,
    [optionsPerson],
  );

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'team',
      label: t('submit_for_team'),
      options: optionsTeam,
      showTextIfOnlyOneOption: disableTeamSelect,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'person',
      label: t('submit_as'),
      options: optionsPerson,
      showTextIfOnlyOneOption: disablePersonSelect,
    },
  ];

  const buttons = [
    {
      onClick: () => setChooseSubmitter(false),
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('choose'),
      color: 'primary',
    },
  ];

  return (
    <>
      <Card
        items={{
          ...game,
          isPastGame,
          onClick: openSubmitScore,
        }}
        type={CARD_TYPE_ENUM.TWO_TEAM_GAME}
      />
      <SubmitScoreDialog
        open={submitScore}
        onClose={closeSubmitScore}
        gameId={game.id}
        submissionerInfos={selectedSubmissionerInfos}
      />
      <FormDialog
        open={chooseSubmitter}
        onClose={handleChooseSubmitterClose}
        title={t('choose_submitter')}
        fields={fields}
        formik={formik}
        buttons={buttons}
      />
    </>
  );
}
