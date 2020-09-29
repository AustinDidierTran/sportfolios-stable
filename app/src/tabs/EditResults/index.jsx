import React, { useState, useEffect } from 'react';
import styles from './EditResults.module.css';
import { SELECT_ENUM } from '../../../../common/enums';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import moment from 'moment';
import GameFilters from '../Schedule/Games/GameFilters';
import ScoreSuggestion from './ScoreSuggestion';

export default function EditResults() {
  const { id: eventId } = useParams();
  const [games, setGames] = useState([]);
  const onlyPast = true;

  useEffect(() => {
    getGames();
  }, [eventId]);

  const sortGames = games => {
    const res = games
      .filter(
        game =>
          moment(game.start_time)
            .set('hour', 0)
            .set('minute', 0)
            .add(1, 'day') < moment(),
      )
      .sort((a, b) => moment(a.start_time) - moment(b.start_time));
    return res;
  };

  const getGames = async () => {
    const { data } = await api(
      formatRoute('/api/entity/games', null, { eventId }),
    );
    const res = sortGames(data);
    setGames(res);
    return res;
  };

  const filter = async (teamId, phaseId, field, timeSlot) => {
    let games = await getGames();
    if (teamId != SELECT_ENUM.ALL) {
      games = games.filter(game =>
        game.teams.some(team => team.roster_id === teamId),
      );
    }
    if (phaseId != SELECT_ENUM.ALL) {
      games = games.filter(game => game.phase_id === phaseId);
    }
    if (field != SELECT_ENUM.ALL) {
      games = games.filter(game => game.field === field);
    }
    if (timeSlot != SELECT_ENUM.ALL) {
      games = games.filter(
        game =>
          moment(game.start_time).format('YYYY M D') ===
          moment(timeSlot).format('YYYY M D'),
      );
    }
    setGames(games);
  };

  const update = () => {
    getGames();
  };

  return (
    <>
      <GameFilters update={filter} onlyPast={onlyPast} />
      <div className={styles.main} style={{ marginTop: '16px' }}>
        {games.map(game => (
          <ScoreSuggestion game={game} update={update} />
        ))}
      </div>
    </>
  );
}
