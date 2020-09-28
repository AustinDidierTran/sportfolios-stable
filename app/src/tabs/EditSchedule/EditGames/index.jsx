import React, { useState, useEffect } from 'react';
import styles from './EditGames.module.css';
import { SELECT_ENUM } from '../../../../../common/enums';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import moment from 'moment';
import EditGame from './EditGame';
import GameFilters from './GameFilters';
import { Icon } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import { useTranslation } from 'react-i18next';

export default function EditGames(props) {
  const { updated } = props;
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames();
  }, [eventId, updated]);

  const sortGames = games => {
    const res = games
      .filter(
        game =>
          moment(game.start_time)
            .set('hour', 0)
            .set('minute', 0)
            .add(1, 'day') > moment(),
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
      <GameFilters update={filter} />
      <div className={styles.proTip}>
        {window.innerWidth < 768 ? (
          <></>
        ) : (
          <Icon icon="EmojiObjects" color="grey" />
        )}
        <Typography color="textSecondary" variant="body2">
          {t('you_can_click_on_a_game_to_change_score')}
        </Typography>
      </div>
      <div className={styles.main} style={{ marginTop: '16px' }}>
        {games.map(game => (
          <EditGame update={update} game={game} />
        ))}
      </div>
    </>
  );
}
