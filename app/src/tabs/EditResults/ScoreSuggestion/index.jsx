import React from 'react';

import { Card } from '../../../../components/Custom';
import { CARD_TYPE_ENUM } from '../../../../../../common/enums';

export default function Game(props) {
  const { game } = props;
  // const [suggestions, setSuggestions] = useState([]);

  // const getSuggestions = async()=>{
  //   const { data } = await api(
  //     formatRoute('/api/entity/scoreSuggestions', null, { eventId }),
  //   );
  // }

  return (
    <>
      <Card
        items={{
          ...game,
          onClick: openSubmitScore,
          role,
        }}
        type={CARD_TYPE_ENUM.GAME}
      />
    </>
  );
}
