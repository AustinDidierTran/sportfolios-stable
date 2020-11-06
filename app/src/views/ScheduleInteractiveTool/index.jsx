import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { formatDate } from '../../utils/stringFormats';
import { Typography } from '../../components/MUI';
import { LoadingSpinner, Icon } from '../../components/Custom';
import { Fab, makeStyles, Tooltip } from '@material-ui/core';
import styles from './ScheduleInteractiveTool.module.css';
import { goBack } from '../../actions/goTo';
import GameCard from './GameCard';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
  fabCancel: {
    position: 'absolute',
    bottom: theme.spacing(4) + 56,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
  fabSave: {
    position: 'absolute',
    bottom: theme.spacing(6) + 112,
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
  const [madeChanges, setMadeChanges] = useState(false);
  const [initialLayout, setInitialLayout] = useState([]);
  const [layout, setLayout] = useState([]);
  const [changes, setChanges] = useState([]);

  const getData = async () => {
    setIsLoading(true);
    const { data } = await api(
      formatRoute('/api/entity/interactiveTool', null, { eventId }),
    );

    setFields(
      data.fields.map((f, index) => ({
        ...f,
        fieldId: index + 1,
      })),
    );
    setTimeslots(
      data.timeSlots.map((ts, index) => ({
        ...ts,
        slotId: index + 1,
      })),
    );
    setGames(
      data.games.map(g => ({
        ...g,
        x: data.fields.findIndex(f => f.field === g.field) + 1,
        y:
          data.timeSlots.findIndex(ts => ts.date === g.start_time) +
          1,
        field: undefined,
        start_time: undefined,
      })),
    );

    console.log({ data });

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const timeArr = timeslots.reduce(
      (prev, time, i) => [
        ...prev,
        {
          i: time.id,
          x: 0,
          y: i + 1,
          w: 1,
          h: 1,
          static: true,
        },
      ],
      [],
    );

    const fieldArr = fields.reduce(
      (prev, field, i) => [
        ...prev,
        {
          i: field.id,
          x: i + 1,
          y: 0,
          w: 1,
          h: 1,
          static: true,
        },
      ],
      [],
    );

    const gameArr = games.reduce(
      (prev, game) => [
        ...prev,
        {
          i: game.id,
          x: game.x,
          y: game.y,
          w: 1,
          h: 1,
          isBounded: true,
        },
      ],
      [],
    );

    const res = [].concat(timeArr, fieldArr, gameArr, [
      { i: 'empty', x: 0, y: 0, w: 1, h: 1, static: true },
    ]);

    setInitialLayout(res);
    setLayout(res);
  }, [fields, timeslots, games]);

  const onDragStop = (layout, oldItem, newItem) => {
    setGames(games => {
      const oldGameIndex = games.findIndex(
        g => g.x === oldItem.x && g.y === oldItem.y,
      );

      games[oldGameIndex] = {
        ...games[oldGameIndex],
        x: newItem.x,
        y: newItem.y,
      };

      return games;
    });

    setLayout(layout);

    setMadeChanges(true);
  };

  const handleCancel = async () => {
    setLayout(initialLayout);
    setMadeChanges(false);
  };

  const handleSave = () => {
    console.log('save');

    /*const gameIds = games.map(g => g.id);
    const onlyGames = newLayout.filter(g => gameIds.includes(g.i));
    const changedGame = onlyGames.filter(
      ({ x: x1, y: y1, i: i1 }) =>
        !initialLayout.some(
          ({ x: x2, y: y2, i: i2 }) =>
            x1 === x2 && y1 === y2 && i1 === i2,
        ),
    );*/

    // to api zoop
  };

  const Fields = fields.map(f => (
    <div className={styles.divField} key={f.id}>
      <Typography className={styles.label}>{f.field}</Typography>
    </div>
  ));

  const Times = timeslots.map(t => (
    <div className={styles.divTime} key={t.id}>
      <Typography className={styles.label}>
        {formatDate(moment(t.date), 'DD MMM HH:mm')}
      </Typography>
    </div>
  ));

  const Games = games.map(g => (
    <div className={styles.itemDiv} key={g.id}>
      <GameCard
        team1={g.teams[0].name}
        team2={g.teams[1].name}
        fields={fields}
        timeSlots={timeslots}
        x={g.x}
        y={g.y}
      />
    </div>
  ));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <GridLayout
        className={styles.gridLayout}
        cols={fields?.length + 1}
        rowHeight={64}
        width={(fields?.length + 1) * 192}
        preventCollision
        compactType={null}
        margin={[20, 20]}
        onDragStop={onDragStop}
        layout={layout}
      >
        <div className={styles.divAdd} key={'empty'}></div>
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

      <Tooltip title={t('cancel')}>
        <div>
          <Fab
            color="secondary"
            onClick={handleCancel}
            className={classes.fabCancel}
            disabled={!madeChanges}
          >
            <Icon icon="Cancel" />
          </Fab>
        </div>
      </Tooltip>

      <Tooltip title={t('save')}>
        <div>
          <Fab
            color="primary"
            onClick={handleSave}
            className={classes.fabSave}
            disabled={!madeChanges}
          >
            <Icon icon="SaveIcon" />
          </Fab>
        </div>
      </Tooltip>
    </div>
  );
}
