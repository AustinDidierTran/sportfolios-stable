import React from 'react';
import styles from './PlayerCard.module.css';
import { ROSTER_ROLE_ENUM } from '../../../../../../../common/enums';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../../../components/Custom';

export default function PlayerCard(props) {
  const { player, role, onDelete } = props;
  const { t } = useTranslation();
  const onPlayerDeleteFromRoster = () => {
    onDelete(player.id);
  };

  if (role == ROSTER_ROLE_ENUM.CAPTAIN) {
    return (
      <div className={styles.card}>
        <div className={styles.player}>
          <div className={styles.position}>{}</div>
          <div className={styles.name}>{player && player.name}</div>
          {player.isSub ? (
            <div className={styles.isSub}>
              <Chip
                label={t('sub')}
                color="primary"
                variant="outlined"
                className={styles.chip}
              />
            </div>
          ) : (
            <></>
          )}
          <div className={styles.icon}>
            <IconButton
              onClick={onPlayerDeleteFromRoster}
              icon="Delete"
              style={{ color: 'grey' }}
              tooltip={t('delete')}
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
        {player.isSub ? (
          <div className={styles.isSub}>
            <Chip
              label={t('sub')}
              color="primary"
              variant="outlined"
              className={styles.chip}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
