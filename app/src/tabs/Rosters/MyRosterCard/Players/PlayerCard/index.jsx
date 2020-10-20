import React from 'react';
import styles from './PlayerCard.module.css';
import { ROSTER_ROLE_ENUM } from '../../../../../../../common/enums';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../../../components/Custom';
import { Typography } from '../../../../../components/MUI';
import api from '../../../../../actions/api';
import { formatRoute } from '../../../../../actions/goTo';

export default function PlayerCard(props) {
  const { isEventAdmin, player, role, onDelete } = props;
  const { t } = useTranslation();

  const onPlayerDeleteFromRoster = () => {
    onDelete(player.id);
  };

  const getPersonInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/personInfos', null, {
        entityId: personId,
      }),
    );
  };

  const onAboutClick = async e => {
    console.log('about this person');
    console.log(e);

    //const playerInfos = getPersonInfos();
  };

  if (role == ROSTER_ROLE_ENUM.CAPTAIN) {
    return (
      <div className={styles.card}>
        <div className={styles.player}>
          <div className={styles.position}>
            {isEventAdmin ? (
              <IconButton
                icon="Info"
                style={{ color: 'grey' }}
                onClick={onAboutClick}
              />
            ) : (
              <></>
            )}
          </div>
          <div className={styles.name}>
            <Typography>{player && player.name}</Typography>
          </div>
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
        <div className={styles.name}>
          <Typography>{player && player.name}</Typography>
        </div>
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
