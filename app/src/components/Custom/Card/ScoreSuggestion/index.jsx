import React, { useState, useEffect } from 'react';

import styles from './ScoreSuggestion.module.css';

import { IconButton } from '../../';
import { Typography, ListItemText, Card } from '../../../MUI';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { STATUS_ENUM } from '../../../../../../common/enums';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';

const useStyles = makeStyles(() => ({
  secondary: {
    background: '#f44336',
    '&:hover, &.Mui-focusVisible': { backgroundColor: '#b2102f' },
  },
  primary: {
    background: '#18B393',
    '&:hover, &.Mui-focusVisible': { backgroundColor: '#009687' },
  },
  even: {
    background: '#e9e9e9',
  },
  odd: {
    background: 'lightGrey',
  },
}));

export default function ScoreSuggestion(props) {
  const { game, suggestion, index, update } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  const [message, setMessage] = useState(t('anonymous'));

  const getPersonName = async () => {
    if (!suggestion.created_by) {
      return { name: t('anonymous') };
    }
    const {
      data: { basicInfos: data },
    } = await api(
      formatRoute('/api/entity', null, { id: suggestion.created_by }),
    );
    return { name: data.name, surname: data.surname };
  };

  const getMessage = async () => {
    const name = await getPersonName();
    if (suggestion.number === 2) {
      setMessage(
        t('name_and_x_other', {
          name: name.name,
          number: suggestion.number - 1,
        }),
      );
    } else if (suggestion.number > 2) {
      setMessage(
        t('name_and_x_others', {
          name: name.name,
          number: suggestion.number - 1,
        }),
      );
    } else {
      if (name.surname) {
        setMessage(`${name.name} ${name.surname}`);
      } else {
        setMessage(name.name);
      }
    }
  };

  useEffect(() => {
    getMessage();
  }, [suggestion]);

  let className = classes.odd;
  if (index % 2 === 0) {
    className = classes.even;
  }

  let chipColor = 'primary';
  if (suggestion.status === STATUS_ENUM.PENDING) {
    chipColor = 'default';
  }
  if (suggestion.status === STATUS_ENUM.REFUSED) {
    chipColor = 'secondary';
  }

  let score1;
  let score2;
  if (game.teams[0].roster_id === suggestion.your_roster_id) {
    score1 = suggestion.your_score;
    score2 = suggestion.opposing_team_score;
  } else {
    score1 = suggestion.opposing_team_score;
    score2 = suggestion.your_score;
  }

  const updateStatus = async status => {
    await api('/api/entity/updateSuggestionStatus', {
      method: 'PUT',
      body: JSON.stringify({
        gameId: game.id,
        eventId: suggestion.event_id,
        yourRosterId: suggestion.your_roster_id,
        opposingRosterId: suggestion.opposing_roster_id,
        yourScore: suggestion.your_score,
        opposingTeamScore: suggestion.opposing_team_score,
        status,
      }),
    });
    update();
  };

  const accept = () => {
    updateStatus(STATUS_ENUM.ACCEPTED);
  };
  const refuse = () => {
    updateStatus(STATUS_ENUM.REFUSED);
  };

  return (
    <Card className={className}>
      <div className={styles.card}>
        <div className={styles.game}>
          <ListItemText
            className={styles.person}
            primary={message}
            secondary={formatDate(
              moment(suggestion.created_at),
              'D MMM H:mm',
            )}
          ></ListItemText>
          <Typography className={styles.score1}>{score1}</Typography>
          <Typography className={styles.union}>-</Typography>
          <Typography className={styles.score2}>{score2}</Typography>
          <Chip
            label={t(suggestion.status)}
            color={chipColor}
            variant="outlined"
            className={styles.status}
            size="small"
          />
        </div>
        <div className={styles.buttons}>
          <IconButton
            className={classes.primary}
            icon="Check"
            color="inherit"
            onClick={accept}
            style={{ margin: '4px' }}
          />
          <IconButton
            className={classes.secondary}
            color="inherit"
            icon="Close"
            onClick={refuse}
            style={{ margin: '4px' }}
          />
        </div>
      </div>
    </Card>
  );
}
