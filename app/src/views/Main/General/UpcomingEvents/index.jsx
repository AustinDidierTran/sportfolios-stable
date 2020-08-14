import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { formatRoute, goTo, ROUTES } from '../../../../actions/goTo';
import api from '../../../../actions/api';
import moment from 'moment';
import { formatIntervalDate } from '../../../../utils/stringFormats';
import {
  Button,
  Avatar,
  ImageCard,
} from '../../../../components/Custom';
import { useContext } from 'react';
import { Store, SCREENSIZE_ENUM } from '../../../../Store';
import styles from './UpcomingEvents.module.css';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    flex: '1 1 auto',
    margin: '4px auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  media2: {
    height: 200,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    gridArea: 'more',
    alignSelf: 'center',
    justifySelf: 'center',
    transform: 'rotate(0deg)',

    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {},
}));

const getEvent = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/eventInfos', null, {
      id: eventId,
    }),
  );
  return data;
};

const flag = false;

export default function UpcomingEvents(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [event, setEvent] = useState({});
  const {
    state: { screenSize },
  } = useContext(Store);
  const { eventId } = props;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getData = async () => {
    const event = await getEvent(eventId);
    setEvent(event);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!event) {
    return <></>;
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        className={styles.header}
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            photoUrl={(event.creator && event.creator.photoUrl) || ''}
          ></Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon style={flag ? {} : { color: '#fff' }} />
          </IconButton>
        }
        title={event.name || ''}
        subheader={
          (event.creator && event.creator.name) || 'Sportfolios'
        }
      />
      <ImageCard
        onClick={() => goTo(ROUTES.entity, { id: eventId })}
        className={
          screenSize == SCREENSIZE_ENUM.xs
            ? classes.media
            : classes.media2
        }
        photoUrl={event.photoUrl || ''}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="left"
        >
          {(event.quickDescription &&
            decodeURIComponent(event.quickDescription)) ||
            '5v5 mixte, format À Bout de Soufle'}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="left"
        >
          {formatIntervalDate(
            moment(event.startDate),
            moment(event.endDate),
          )}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="left"
        >
          {event.location || 'Sherbrooke'}
        </Typography>
      </CardContent>
      <CardActions className={styles.actions} disableSpacing>
        <Button
          onClick={() => goTo(ROUTES.entity, { id: eventId })}
          style={{ width: '50px' }}
          className={styles.eventButton}
        >
          {t('learn_more')}
        </Button>
        {flag ? (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        ) : null}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {decodeURIComponent(event.description) || ''}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
