import React, { useEffect, useState, useMemo } from 'react';
import styles from './EditGames.module.css';
import { Collapse, IconButton } from '../../../../components/Custom';
import { Typography } from '../../../../components/MUI';
import { Divider } from '@material-ui/core';
import ScoreSuggestion from './ScoreSuggestion';
import { useTranslation } from 'react-i18next';

export default function EditGames(props) {
  const { games, title, isOpen, update } = props;
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(isOpen);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const icon = useMemo(
    () => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'),
    [expanded],
  );

  useEffect(() => {
    setExpanded(isOpen);
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
          <>
            {games.map(game => (
              <ScoreSuggestion
                game={game}
                update={update}
                key={game.id}
              />
            ))}
          </>
        ) : (
          <Typography color="textSecondary">
            {t('no_games')}
          </Typography>
        )}
      </Collapse>
    </>
  );
}
