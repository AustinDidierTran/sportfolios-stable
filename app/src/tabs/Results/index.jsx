import React, { useState, useEffect } from 'react';
import styles from './Results.module.css';
import { SELECT_ENUM } from '../../../../common/enums';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import moment from 'moment';
import Game from '../Schedule/Games/Game';
import GameFilters from '../Schedule/Games/GameFilters';
import SubmitScore from '../Schedule/SubmitScore';

export default function Results() {
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

  const filter = async (teamName, phaseId, field, timeSlot) => {
    let games = await getGames();
    if (teamName != SELECT_ENUM.ALL) {
      games = games.filter(game =>
        game.teams.some(team => team.name === teamName),
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
      <SubmitScore />
      <GameFilters update={filter} onlyPast={onlyPast} />
      <div className={styles.main} style={{ marginTop: '16px' }}>
        {games.map(game => (
          <Game update={update} game={game} />
        ))}
      </div>
    </>
  );
}
