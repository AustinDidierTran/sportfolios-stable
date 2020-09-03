import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/Custom';
import styles from './Games.module.css';
import {
  CARD_TYPE_ENUM,
  SELECT_ENUM,
} from '../../../../../common/enums';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import moment from 'moment';
import TeamSelect from './TeamSelect';
import PhaseSelect from './PhaseSelect';

export default function Games() {
  const { id: eventId } = useParams();
  const [games, setGames] = useState([]);
  const [teamName, setTeamName] = useState(SELECT_ENUM.NONE);
  const [phaseId, setPhaseId] = useState(SELECT_ENUM.NONE);

  useEffect(() => {
    getGames();
  }, [eventId]);

  useEffect(() => {
    filter();
  }, [teamName, phaseId]);

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

  const changeTeamName = teamName => {
    setTeamName(teamName);
  };

  const changePhaseId = phaseId => {
    setPhaseId(phaseId);
  };

  const filter = async () => {
    let games = await getGames();
    if (teamName != SELECT_ENUM.NONE) {
      games = games.filter(game => {
        return game.teams.some(team => {
          return team.name === teamName;
        });
      });
    }
    if (phaseId != SELECT_ENUM.NONE) {
      games = games.filter(game => {
        return game.phase_id === phaseId;
      });
    }
    setGames(games);
  };

  return (
    <>
      <div className={styles.select}>
        <TeamSelect onChange={changeTeamName} />
        <PhaseSelect onChange={changePhaseId} />
      </div>
      <div className={styles.main} style={{ marginTop: '16px' }}>
        {games.map(game => {
          return <Card items={game} type={CARD_TYPE_ENUM.GAME} />;
        })}
      </div>
    </>
  );
}
