import React, { useEffect, useState } from 'react';
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
        <Typography className={styles.seeScore} color="textSecondary">
          {title}
        </Typography>
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
