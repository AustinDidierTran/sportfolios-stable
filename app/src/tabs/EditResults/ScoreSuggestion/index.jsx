import React, { useState, useEffect } from 'react';
import {
  CARD_TYPE_ENUM,
  STATUS_ENUM,
} from '../../../../../common/enums';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { Card } from '../../../components/Custom';
import EditGame from '../../EditSchedule/EditGames/EditGame';
import { Card, IconButton } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import Collapse from '@material-ui/core/Collapse';
import { useTranslation } from 'react-i18next';
import styles from './ScoreSuggestion.module.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
  },
}));

export default function ScoreSuggestion(props) {
  const { game, update, withoutEdit } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const [suggestions, setSuggestions] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [icon, setIcon] = useState('KeyboardArrowDown');
  const [message, setMessage] = useState(t('score_suggestions'));

  const handleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (newExpanded === true) {
      setIcon('KeyboardArrowUp');
      setMessage('');
    } else {
      setIcon('KeyboardArrowDown');
      setMessage(t('score_suggestions'));
    }
  };

  const { event_id, start_time, teams } = game;
  const rosterId1 = teams[0].roster_id;
  const rosterId2 = teams[1].roster_id;

  useEffect(() => {
    getSuggestions();
  }, []);

  const getSuggestions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/scoreSuggestion', null, {
        event_id,
        start_time,
        rosterId1,
        rosterId2,
      }),
    );
    setSuggestions(data);
    const expanded = !data.some(s => s.status != STATUS_ENUM.PENDING);
    if (!expanded) {
      setTimeout(() => {
        setExpanded(expanded);
        setIcon('KeyboardArrowDown');
        setMessage(t('score_suggestions'));
      }, 1000);
    }
  };

  const updateSuggestions = () => {
    update();
    getSuggestions();
  };

  return (
    <>
      <EditGame
        update={update}
        game={game}
        withoutEdit={withoutEdit || suggestions.length}
      />
      {suggestions.length ? (
        <>
          <div className={styles.collapse}>
            <Typography
              className={styles.seeScore}
              color="textSecondary"
              onClick={handleExpand}
            >
              {message}
            </Typography>
            <IconButton
              onClick={handleExpand}
              aria-expanded={expanded}
              icon={icon}
              className={classes.primary}
              style={{ color: 'grey' }}
            />
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {suggestions.map((suggestion, index) => (
              <Card
                type={CARD_TYPE_ENUM.SCORE_SUGGESTION}
                items={{
                  game,
                  suggestion,
                  index,
                  update: updateSuggestions,
                }}
              />
            ))}
          </Collapse>
        </>
      ) : (
        <div style={{ marginBottom: '16px' }}></div>
      )}
    </>
  );
}
