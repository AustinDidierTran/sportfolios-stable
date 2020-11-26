import React, { useState } from 'react';

import { Card, FormDialog } from '../../../../../components/Custom';
import {
  CARD_TYPE_ENUM,
  FORM_DIALOG_TYPE_ENUM,
} from '../../../../../../../common/enums';
import SubmitScoreDialog from '../../../../../components/Custom/FormDialog/SubmitScoreSpiritForm';

export default function Game(props) {
  const { game, isPastGame } = props;

  const [submitScore, setSubmitScore] = useState(false);

  const closeSubmitScore = () => {
    setSubmitScore(false);
  };
  const openSubmitScore = () => {
    setSubmitScore(true);
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
      />
      {/* <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.SUBMIT_SCORE_AND_SPIRIT}
        items={{
          open: submitScore,
          onClose: closeSubmitScore,
          game: game,
        }}
      /> */}
    </>
  );
}
