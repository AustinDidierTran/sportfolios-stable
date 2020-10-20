import React, { useEffect, useState } from 'react';
import styles from './Players.module.css';
import Tag from '../../Tag';
import { ENTITIES_ROLE_ENUM } from '../../../../Store';
import { Typography } from '../../../../components/MUI';
import { useTranslation } from 'react-i18next';

export default function Players(props) {
  const { t } = useTranslation();
  const { players, role } = props;
  const [playersUpdated, setPlayersUpdated] = useState([]);

  const getData = async () => {
    const playersUpdated = players.map(p => {
      //TODO: Api call to know if player has an account
      return { ...p, status: 'registered' };
    });
    setPlayersUpdated(playersUpdated);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!playersUpdated) {
    return <></>;
  }

  if (role == ENTITIES_ROLE_ENUM.VIEWER) {
    return (
      <div className={styles.card}>
        {playersUpdated.map((player, index) => (
          <div className={styles.player} key={player.id}>
            <div className={styles.position}>
              <Typography>{`${index}`}</Typography>
            </div>
            <div className={styles.name}>
              <Typography>{player && player.name}</Typography>
            </div>
            <div className={styles.pod}>
              <Tag type={player.status} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!playersUpdated.length) {
    return (
      <div className={styles.card}>
        <Typography>{t('empty_roster')}</Typography>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {playersUpdated.map((player, index) => (
        <div className={styles.player} key={player.id}>
          <div className={styles.position}>
            <Typography>{`${index}`}</Typography>
          </div>
          <div className={styles.name}>
            <Typography>{player.name}</Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
