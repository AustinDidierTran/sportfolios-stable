import React, { useContext, useState } from 'react';

import { Card } from '../../../../../components/Custom';
import {
  CARD_TYPE_ENUM,
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../../common/enums';
import SubmitScoreDialog from '../../../../../components/Custom/FormDialog/SubmitScoreSpiritForm';
import { ACTION_ENUM, Store } from '../../../../../Store';
import api from '../../../../../actions/api';
import { formatRoute } from '../../../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function Game(props) {
  const { game, isPastGame } = props;
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const [submitScore, setSubmitScore] = useState(false);
  const [submissionerGameInfos, setSubmissionerGameInfos] = useState(
    {},
  );

  const closeSubmitScore = () => {
    setSubmitScore(false);
  };
  const openSubmitScore = async () => {
    // if user is coach/captain/assistant-captain of one of the teams
    const { status, data } = await api(
      formatRoute('/api/entity/getSubmissionerInfos', null, {
        gameId: game.id,
      }),
      { method: 'GET' },
    );

    if (status === STATUS_ENUM.FORBIDDEN) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you_are_not_in_any_of_these_teans'),
        severity: SEVERITY_ENUM.INFO,
      });
    } else if (data.canSubmitScore) {
      setSubmissionerGameInfos(data.gameInfos);
      setSubmitScore(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('invalid_roster_role_to_submit_score'),
        severity: SEVERITY_ENUM.INFO,
      });
    }
  };

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
        game={game}
        submissionerGameInfos={submissionerGameInfos}
      />
    </>
  );
}
