import React, { useState, useEffect } from 'react';
import {
  CARD_TYPE_ENUM,
  STATUS_ENUM,
} from '../../../../../../../common/enums';
import api from '../../../../../actions/api';
import { formatRoute } from '../../../../../actions/goTo';
import EditGame from './EditGame';
import {
  Card,
  IconButton,
  Collapse,
} from '../../../../../components/Custom';
import { Typography } from '../../../../../components/MUI';
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
  const [message, setMessage] = useState('');

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

  const { event_id, id: gameId } = game;

  useEffect(() => {
    getSuggestions();
  }, []);

  const getSameSuggestions = (suggestions, suggestion) => {
    return suggestions.filter(s => {
      return (
        (s.your_roster_id === suggestion.your_roster_id &&
          s.opposing_roster_id === suggestion.opposing_roster_id &&
          s.your_score === suggestion.your_score &&
          s.opposing_team_score === suggestion.opposing_team_score) ||
        (s.your_roster_id === suggestion.opposing_roster_id &&
          s.opposing_roster_id === suggestion.your_roster_id &&
          s.your_score === suggestion.opposing_team_score &&
          s.opposing_team_score === suggestion.your_score)
      );
    });
  };

  const getSuggestions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/scoreSuggestion', null, {
        event_id,
        gameId,
      }),
    );

    const res = data.reduce((prev, curr) => {
      if (prev.length < 1) {
        return [...prev, curr];
      }
      const samesugg = getSameSuggestions(prev, curr);
      if (samesugg.length < 1) {
        return [...prev, curr];
      }
      return [...prev];
    }, []);

    const res2 = res
      .map(m => ({
        ...m,
        number: getSameSuggestions(data, m).length,
      }))
      .sort((a, b) => b.number - a.number);

    setSuggestions(res2);
    const expanded = res2.some(s => s.status === STATUS_ENUM.PENDING);
    if (!expanded) {
      setTimeout(() => {
        setExpanded(expanded);
        setIcon('KeyboardArrowDown');
        setMessage(t('score_suggestions'));
      }, 1000);
    } else {
      setExpanded(expanded);
      setIcon('KeyboardArrowUp');
      setMessage('');
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
                key={index}
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
