import React, { useState, useEffect } from 'react';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { Card } from '../../../components/Custom';
import EditGame from '../../EditSchedule/EditGames/EditGame';

export default function ScoreSuggestion(props) {
  const { game, update, withoutEdit } = props;
  const [suggestions, setSuggestions] = useState([]);

  const { event_id, start_time, teams } = game;
  const rosterId1 = teams[0].roster_id;
  const rosterId2 = teams[1].roster_id;

  useEffect(() => {
    getSuggestions();
  }, []);

  const getSuggestions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/scoreSuggestion', null, {
        event_id,
        start_time,
        rosterId1,
        rosterId2,
      }),
    );
    setSuggestions(data);
  };
  const updateSuggestions = () => {
    update();
    getSuggestions();
  };
  return (
    <>
      <EditGame
        update={update}
        game={game}
        withoutEdit={withoutEdit || suggestions.length}
      />
      <div style={{ marginBottom: '16px' }}>
        {suggestions.map((suggestion, index) => (
          <Card
            type={CARD_TYPE_ENUM.SCORE_SUGGESTION}
            items={{
              game,
              suggestion,
              index,
              update: updateSuggestions,
            }}
          />
        ))}
      </div>
    </>
  );
}
