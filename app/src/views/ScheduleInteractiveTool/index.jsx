import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { formatDate } from '../../utils/stringFormats';
import { Typography, Card } from '../../components/MUI';
import {
  Avatar,
  LoadingSpinner,
  Icon,
} from '../../components/Custom';
import { Fab, makeStyles, Tooltip } from '@material-ui/core';
import styles from './ScheduleInteractiveTool.module.css';
import { getInitialsFromName } from '../../utils/stringFormats/index';
import { goBack } from '../../actions/goTo';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
}));

export default function ScheduleInteractiveTool() {
  const { id: eventId } = useParams();
  const classes = useStyles();
  const { t } = useTranslation();

  const [games, setGames] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSlots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/slots', null, { eventId }),
    );
    const res = data.map((d, index) => ({
      ...d,
      slotId: index + 1,
    }));
    //console.log(res);
    setTimeslots(res);
  };

  const getFields = async () => {
    const { data } = await api(
      formatRoute('/api/entity/fields', null, { eventId }),
    );
    const res = data.map((f, index) => ({
      ...f,
      fieldId: index + 1,
    }));
    //console.log(res);
    setFields(res);
  };

  const getGames = async () => {
    const { data } = await api(
      formatRoute('/api/entity/games', null, { eventId }),
    );
    //console.log(data);
    setGames(data);
  };

  const getAll = async () => {
    setIsLoading(true);
    await getSlots();
    await getFields();
    await getGames();
    setIsLoading(false);
  };

  useEffect(() => {
    getAll();
  }, []);

  const Fields = fields.map((f, index) => (
    <div
      className={styles.divField}
      key={`f${index}`}
      data-grid={{
        x: index + 1,
        y: 0,
        w: 1,
        h: 1,
        static: true,
      }}
    >
      <Typography className={styles.label}>{f.field}</Typography>
    </div>
  ));

  const Times = timeslots.map((t, index) => (
    <div
      className={styles.divTime}
      key={`ts${index}`}
      data-grid={{
        x: 0,
        y: index + 1,
        w: 1,
        h: 1,
        static: true,
      }}
    >
      <Typography className={styles.label}>
        {formatDate(moment(t.date), 'DD MMM HH:mm')}
      </Typography>
    </div>
  ));

  const Games = games.map((g, index) => (
    <div
      className={styles.labelDiv}
      key={`g${index}`}
      data-grid={{
        x: fields.find(f => f.field === g.field)?.fieldId,
        y: timeslots.find(ts => ts.date === g.start_time)?.slotId,
        w: 1,
        h: 1,
        static: true,
      }}
    >
      <Card className={styles.gameCard}>
        <div className={styles.gameDiv}>
          <Tooltip title={g.teams[0].name}>
            <div className={styles.team1}>
              <Avatar
                initials={getInitialsFromName(g.teams[0].name)} // or team pic?
              ></Avatar>
            </div>
          </Tooltip>
          <Typography className={styles.vs}>vs</Typography>
          <Tooltip title={g.teams[1].name}>
            <div className={styles.team2}>
              <Avatar
                initials={getInitialsFromName(g.teams[1].name)} // or team pic?
              ></Avatar>
            </div>
          </Tooltip>
        </div>
      </Card>
    </div>
  ));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <GridLayout
        className={styles.gridLayout}
        cols={fields?.length + 2}
        rowHeight={64}
        width={window.screen.width}
        preventCollision
        compactType={null}
        margin={[20, 20]}
      >
        <div
          key={'empty'}
          data-grid={{
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            static: true,
          }}
        ></div>
        {Fields}
        {Times}
        {Games}
      </GridLayout>
      <Tooltip title={t('back')}>
        <Fab
          color="primary"
          onClick={() => goBack()} // ask if want to save changes
          className={classes.fab}
        >
          <Icon icon="ArrowBack" />
        </Fab>
      </Tooltip>
    </div>
  );
}
