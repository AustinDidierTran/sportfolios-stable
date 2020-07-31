import React, { useEffect, useState } from 'react';
import styles from './Players.module.css';
import Tag from '../../Tag';
import { ENTITIES_ROLE_ENUM } from '../../../../Store';

export default function Players(props) {
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

  if (role == ENTITIES_ROLE_ENUM.VIEWER) {
    return (
      <div className={styles.card}>
        {playersUpdated &&
          playersUpdated.map((player, index) => {
            return (
              <div className={styles.player}>
                <div className={styles.position}>{`${index}`}</div>
                <div className={styles.name}>
                  {player && player.name}
                </div>
                <div className={styles.pod}>
                  <Tag type={player.status} />
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {playersUpdated &&
        playersUpdated.map((player, index) => {
          return (
            <div className={styles.player}>
              <div className={styles.position}>{`${index}`}</div>
              <div className={styles.name}>{player.name}</div>
            </div>
          );
        })}
    </div>
  );
}
