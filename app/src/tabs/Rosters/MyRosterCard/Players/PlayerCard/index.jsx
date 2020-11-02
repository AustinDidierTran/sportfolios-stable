import React, { useState } from 'react';
import styles from './PlayerCard.module.css';
import { ROSTER_ROLE_ENUM } from '../../../../../../../common/enums';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../../../components/Custom';
import PersonInfoDialog from '../../../../../components/Custom/Dialog/PersonInfosDialog';
import { Typography } from '../../../../../components/MUI';
import api from '../../../../../actions/api';
import { formatRoute } from '../../../../../actions/goTo';
import PaymentChip from '../../../../../tabs/Settings/TeamRegistered/PaymentChip';

export default function PlayerCard(props) {
  const { isEventAdmin, player, role, onDelete } = props;
  const { t } = useTranslation();

  const [playerInfos, setPlayerInfos] = useState(null);
  const [open, setOpen] = useState(false);

  const closePlayerAcceptation = () => {
    setOpen(false);
  };

  const openPlayerAcceptation = () => {
    setOpen(true);
  };

  const onPlayerAccept = () => {
    // eslint-disable-next-line
    console.log('accepting');
    // do things
    closePlayerAcceptation();
  };

  const onPlayerDecline = () => {
    // eslint-disable-next-line
    console.log('declining');
    // do things
    closePlayerAcceptation();
  };

  const onPlayerDeleteFromRoster = () => {
    onDelete(player.id);
  };

  const getPersonInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/personInfos', null, {
        entityId: player.personId,
      }),
    );
    setPlayerInfos(data);
  };

  const onAboutClick = async () => {
    await getPersonInfos();
    openPlayerAcceptation();
  };

  if (isEventAdmin || role == ROSTER_ROLE_ENUM.CAPTAIN) {
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
            <PaymentChip
              status={player.paymentStatus}
              className={styles.chip}
            />
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
        <PersonInfoDialog
          open={open}
          personInfos={playerInfos}
          onSubmit={onPlayerAccept}
          onDecline={onPlayerDecline}
          onClose={closePlayerAcceptation}
        />
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
