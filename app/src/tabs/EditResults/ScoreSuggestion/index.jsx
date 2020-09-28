import React, { useState, useEffect } from 'react';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import EditGame from '../../EditSchedule/EditGames/EditGame';

export default function ScoreSuggestion(props) {
  const { game, update } = props;
  /* eslint-disable-next-line */
  const [suggestions, setSuggestions] = useState([]);

  const { event_id, id, start_time, teams } = game;
  const name1 = teams[0].name;
  const rosterId1 = teams[0].roster_id;
  const name2 = teams[1].name;
  const rosterId2 = teams[1].roster_id;

  useEffect(() => {
    getSuggestions();
  }, []);

  const getSuggestions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/scoreSuggestion', null, {
        event_id,
        id,
        start_time,
        name1,
        rosterId1,
        name2,
        rosterId2,
      }),
    );
    setSuggestions(data);
  };

  return <EditGame update={update} game={game} />;
}
