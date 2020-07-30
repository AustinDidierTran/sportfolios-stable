import React from 'react';
import styles from './Players.module.css';
import Tag from '../Tag';

export default function Players(props) {
  const { players } = props;

  return (
    <div className={styles.card}>
      {players &&
        players.map(player => {
          return (
            <div className={styles.player}>
              <div className={styles.position}>{`#${0}`}</div>
              <div className={styles.name}>
                {(player && player.name) || 'MY PLAYER'}
              </div>
              <div className={styles.pod}>
                <Tag name={'Done'} />
              </div>
            </div>
          );
        })}
    </div>
  );
}
