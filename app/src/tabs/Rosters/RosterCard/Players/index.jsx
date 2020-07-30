import React, { useEffect, useState } from 'react';
import styles from './Players.module.css';
import Tag from '../../Tag';
import { ENTITIES_ROLE_ENUM } from '../../../../Store';

export default function Players(props) {
  const { players, role = ENTITIES_ROLE_ENUM.VIEWER } = props;
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

  if (role == ENTITIES_ROLE_ENUM.ADMIN) {
    return (
      <div className={styles.card}>
        {playersUpdated &&
          playersUpdated.map(player => {
            return (
              <div className={styles.player}>
                <div className={styles.position}>{`#${player.number ||
                  0}`}</div>
                <div className={styles.name}>
                  {(player && player.name) || 'MY PLAYER'}
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
        playersUpdated.map(player => {
          return (
            <div className={styles.player}>
              <div className={styles.position}>{`#${0}`}</div>
              <div className={styles.name}>
                {(player && player.name) || 'MY PLAYER'}
              </div>
            </div>
          );
        })}
    </div>
  );
}
