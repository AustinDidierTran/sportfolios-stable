import React, { useEffect, useState } from 'react';
import styles from './Players.module.css';
import Tag from '../../Tag';
import { ENTITIES_ROLE_ENUM } from '../../../../Store';
import { Typography } from '../../../../components/MUI';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@material-ui/core';
import { Icon } from '../../../../components/Custom';
import { ROSTER_ROLE_ENUM } from '../../../../../../common/enums';

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

  const getIconFromRole = role => {
    switch (role) {
      case ROSTER_ROLE_ENUM.COACH:
        return 'SportsWhistle';
      case ROSTER_ROLE_ENUM.CAPTAIN:
        return 'Stars';
      case ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN:
        return 'TextFormat';
      default:
        return 'Person';
    }
  };

  if (!playersUpdated) {
    return <></>;
  }

  if (role == ENTITIES_ROLE_ENUM.VIEWER) {
    return (
      <div className={styles.card}>
        {playersUpdated.map(player => (
          <div className={styles.player} key={player.id}>
            <div className={styles.position}>
              {!player.role ||
              player.role === ROSTER_ROLE_ENUM.PLAYER ? (
                <></>
              ) : (
                <Tooltip
                  title={t(
                    player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN
                      ? 'assistant_captain'
                      : player.role,
                  )}
                >
                  <div>
                    <Icon icon={getIconFromRole(player.role)} />
                  </div>
                </Tooltip>
              )}
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
      {playersUpdated.map(player => (
        <div className={styles.player} key={player.id}>
          <div className={styles.position}>
            {!player.role ||
            player.role === ROSTER_ROLE_ENUM.PLAYER ? (
              <></>
            ) : (
              <Tooltip
                title={t(
                  player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN
                    ? 'assistant_captain'
                    : player.role,
                )}
              >
                <div>
                  <Icon icon={getIconFromRole(player.role)} />
                </div>
              </Tooltip>
            )}
          </div>
          <div className={styles.name}>
            <Typography>{player.name}</Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
