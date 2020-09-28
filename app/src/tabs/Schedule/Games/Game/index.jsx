import React, { useState } from 'react';

import { Card, FormDialog } from '../../../../components/Custom';
import {
  CARD_TYPE_ENUM,
  FORM_DIALOG_TYPE_ENUM,
} from '../../../../../../common/enums';

export default function Game(props) {
  const { game } = props;

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
          onClick: openSubmitScore,
        }}
        type={CARD_TYPE_ENUM.TWO_TEAM_GAME}
      />
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.SUBMIT_SCORE_AND_SPIRIT}
        items={{
          open: submitScore,
          onClose: closeSubmitScore,
          game: game,
        }}
      />
    </>
  );
}
