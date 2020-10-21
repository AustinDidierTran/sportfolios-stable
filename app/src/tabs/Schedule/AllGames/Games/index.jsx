import React, { useEffect, useState } from 'react';
import styles from './Games.module.css';
import Game from './Game';
import { Collapse, IconButton } from '../../../../components/Custom';
import { Typography } from '../../../../components/MUI';
import { Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function Games(props) {
  const { games, title, isOpen } = props;
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(isOpen);
  const [icon, setIcon] = useState('KeyboardArrowDown');

  const handleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (newExpanded === true) {
      setIcon('KeyboardArrowUp');
    } else {
      setIcon('KeyboardArrowDown');
    }
  };

  useEffect(() => {
    setExpanded(isOpen);
    if (isOpen) {
      setIcon('KeyboardArrowUp');
    }
  }, [isOpen]);

  return (
    <>
      <div className={styles.collapse} onClick={handleExpand}>
        <div className={styles.nothing} />
        {games.length > 99 ? (
          <Typography
            className={styles.seeScore}
            color="textSecondary"
          >
            {`${title} (99+)`}
          </Typography>
        ) : (
          <Typography
            className={styles.seeScore}
            color="textSecondary"
          >
            {`${title} (${games.length})`}
          </Typography>
        )}
        <IconButton
          aria-expanded={expanded}
          icon={icon}
          className={styles.iconButton}
          style={{ color: 'grey' }}
        />
      </div>
      <Divider className={styles.divider} />
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        className={styles.games}
      >
        {games.length ? (
          games.map(game => <Game game={game} key={game.id} />)
        ) : (
          <Typography color="textSecondary">
            {t('no_games')}
          </Typography>
        )}
      </Collapse>
    </>
  );
}
