import React from 'react';
import styles from './PlayerCard.module.css';
import Tag from '../../../Tag';
import { ROSTER_ROLE_ENUM } from '../../../../../Store';
import { Icon } from '../../../../../components/Custom';

export default function PlayerCard(props) {
  const { player, role, onDelete } = props;

  const onPlayerDeleteFromRoster = () => {
    onDelete(player.id);
  };

  if (role == ROSTER_ROLE_ENUM.CAPTAIN) {
    return (
      <div className={styles.card}>
        <div className={styles.player}>
          <div className={styles.position}>{}</div>
          <div className={styles.name}>{player && player.name}</div>
          <div className={styles.pod}>
            <Tag type={player.status} />
          </div>
          <div className={styles.icon}>
            <Icon
              onClick={onPlayerDeleteFromRoster}
              icon={'Delete'}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.player}>
        <div className={styles.position}>{}</div>
        <div className={styles.name}>{player && player.name}</div>
      </div>
    </div>
  );
}
