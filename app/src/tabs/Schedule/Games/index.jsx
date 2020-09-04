import React, { useState, useEffect } from 'react';
import { Card, Select } from '../../../components/Custom';
import styles from './Games.module.css';
import {
  CARD_TYPE_ENUM,
  SELECT_ENUM,
} from '../../../../../common/enums';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function Games() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getGames();
    getTeams();
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
    return res;
  };

  const getTeams = async () => {
    const { data } = await api(
      formatRoute('/api/entity/teamsSchedule', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.name,
      display: d.name,
    }));

    setTeams([
      { value: SELECT_ENUM.NONE, display: t('none_feminine') },
      ...res,
    ]);
  };

  const onTeamChange = async teamName => {
    const games = await getGames();
    if (teamName === SELECT_ENUM.NONE) {
      return;
    }
    const res = games.filter(game =>
      game.teams.some(team => team.name === teamName),
    );
    setGames(res);
  };

  return (
    <>
      <div className={styles.select}>
        <Select
          options={teams}
          namespace="team"
          autoFocus
          margin="dense"
          label={t('team')}
          fullWidth
          onChange={onTeamChange}
        />
      </div>
      <div className={styles.main} style={{ marginTop: '16px' }}>
        {games.map(game => {
          return <Card items={game} type={CARD_TYPE_ENUM.GAME} />;
        })}
      </div>
    </>
  );
}
