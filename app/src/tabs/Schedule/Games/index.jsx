import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/Custom';
import styles from './Games.module.css';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import moment from 'moment';

export default function Games() {
  const { id: eventId } = useParams();
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames();
  }, [eventId]);

  const sortGames = games => {
    const res = games.sort(
      (a, b) => moment(a.start_time) - moment(b.start_time),
    );
    return res;
  };

  const getGames = async () => {
    const { data } = await api(
      formatRoute('/api/entity/games', null, { eventId }),
    );
    const res = sortGames(data);
    setGames(res);
  };

  return (
    <div className={styles.main} style={{ marginTop: '16px' }}>
      {games.map(game => {
        return <Card items={game} type={CARD_TYPE_ENUM.GAME} />;
      })}
    </div>
  );
}
