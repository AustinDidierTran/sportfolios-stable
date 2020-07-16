import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { formatRoute, goTo, ROUTES } from '../../../../actions/goTo';
import api from '../../../../actions/api';
import CardMedia from '../../../../components/Custom/CardMedia';
import moment from 'moment';
import { formatDate } from '../../../../utils/stringFormats';
import { Button } from '../../../../components/Custom';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const eventId = 'c470298d-3754-4bb8-a2de-387457c4f750';

const getEvent = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity', null, {
      id: eventId,
    }),
  );
  return data;
};

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [event, setEvent] = useState({});

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
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={event.name}
        subheader={event.creator || 'Sportfolios'}
      />
      <CardMedia
        className={classes.media}
        photoUrl={event.photoUrl}
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
          {`${
            formatDate(moment(event.startDate)).split(' ')[0]
          } au ${formatDate(moment(event.endDate))} `}
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
      <CardActions disableSpacing>
        <Button
          onClick={() => goTo(ROUTES.entity, { id: eventId })}
          style={{ width: '50px' }}
        >
          LEARN MORE
        </Button>
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
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{event.description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
