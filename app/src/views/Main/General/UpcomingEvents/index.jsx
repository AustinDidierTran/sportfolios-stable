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
import CardMedia from '../../../../components/Custom/CardMedia';
import moment from 'moment';
import { formatDate } from '../../../../utils/stringFormats';
import { Button, Avatar } from '../../../../components/Custom';
import { useContext } from 'react';
import { Store, SCREENSIZE_ENUM } from '../../../../Store';
import styles from './UpcomingEvents.module.css';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    width: 345,
  },
  root2: {
    width: 650,
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

const eventId = 'c470298d-3754-4bb8-a2de-387457c4f750';

const getEvent = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/eventInfos', null, {
      id: eventId,
    }),
  );
  return data;
};

const flag = false;

export default function RecipeReviewCard() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [event, setEvent] = useState({});
  const {
    state: { screenSize },
  } = useContext(Store);

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

  return (
    <Card
      className={
        screenSize == SCREENSIZE_ENUM.xs
          ? classes.root
          : classes.root2
      }
    >
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            photoUrl={(event.creator && event.creator.photoUrl) || ''}
          ></Avatar>
        }
        action={
          flag ? (
            <IconButton aria-label="settings">
              <MoreVertIcon style={flag ? {} : { color: '#fff' }} />
            </IconButton>
          ) : null
        }
        title={event.name || ''}
        subheader={
          (event.creator && event.creator.name) || 'Sportfolios'
        }
      />
      <CardMedia
        className={
          screenSize == SCREENSIZE_ENUM.xs
            ? classes.media
            : classes.media2
        }
        photoUrl={event.photoUrl || ''}
        title="Paella dish"
      />
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="left"
        >
          {event.quickDescription ||
            '5v5 mixte, format À Bout de Soufle'}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="left"
        >
          {event.startDate && event.endDate
            ? `${
                formatDate(moment(event.startDate)).split(' ')[0]
              } au ${formatDate(moment(event.endDate))} `
            : ''}
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
          <Typography paragraph>{event.description || ''}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
