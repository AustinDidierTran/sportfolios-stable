import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { formatDate } from '../../utils/stringFormats';
import { Typography } from '../../components/MUI';
import {
  LoadingSpinner,
  Icon,
  AlertDialog,
} from '../../components/Custom';
import { Store, ACTION_ENUM } from '../../Store';
import { STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { Fab, makeStyles, Tooltip } from '@material-ui/core';
import styles from './ScheduleInteractiveTool.module.css';
import { goBack } from '../../actions/goTo';
import GameCard from './GameCard';
import AddGame from './AddGame';

import RGL from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import './overridden-placeholder.css';
const ReactGridLayout = RGL;

const useStyles = makeStyles(theme => ({
  fabBack: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
  fabAdd: {
    position: 'absolute',
    bottom: theme.spacing(4) + 56,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
    backgroundColor: '#1c1cff',
    '&:hover': {
      background: '#0000b5',
    },
  },
  fabCancel: {
    position: 'absolute',
    bottom: theme.spacing(6) + 112,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
  fabSave: {
    position: 'absolute',
    bottom: theme.spacing(8) + 168,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
}));

export default function ScheduleInteractiveTool() {
  const { id: eventId } = useParams();
  const classes = useStyles();
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [phases, setPhases] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [fields, setFields] = useState([]);

  const [madeChanges, setMadeChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingGames, setIsAddingGames] = useState(false);

  const [buttonsAdd, setButtonsAdd] = useState([]);
  const [layout, setLayout] = useState([]);
  const [initialLayout, setInitialLayout] = useState([]);

  const [alertDialog, setAlertDialog] = useState(false);
  const [addGameDialog, setAddGameDialog] = useState(false);
  const [addGameField, setAddGameField] = useState({});
  const [addGameTimeslot, setAddGameTimeslot] = useState({});

  const getData = async () => {
    setIsLoading(true);
    const { data } = await api(
      formatRoute('/api/entity/interactiveTool', null, { eventId }),
    );

    setPhases(
      data.phases.map(p => ({
        value: p.id,
        display: p.name,
      })),
    );
    setTeams(
      data.teams.map(t => ({
        value: t.roster_id,
        display: t.name,
      })),
    );
    setFields(data.fields);
    setTimeslots(data.timeSlots);
    setGames(
      data.games.map(g => ({
        ...g,
        x: data.fields.findIndex(f => f.id === g.field_id) + 1,
        y:
          data.timeSlots.findIndex(ts => ts.id === g.timeslot_id) + 1,
      })),
    );
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
    // fix tooltips
    setGames(
      games.map(g => ({
        ...g,
        x: fields.findIndex(f => f.id === g.field_id) + 1,
        y: timeslots.findIndex(ts => ts.id === g.timeslot_id) + 1,
      })),
    );

    setButtonsAdd([]);
    setIsAddingGames(false);

    setLayout(initialLayout);
    setMadeChanges(false);
  };

  const handleSave = async () => {
    const gameIds = games.map(g => g.id);
    const onlyGames = layout.filter(g => gameIds.includes(g.i));
    const changedGames = onlyGames.filter(
      ({ x: x1, y: y1, i: i1 }) =>
        !initialLayout.some(
          ({ x: x2, y: y2, i: i2 }) =>
            x1 === x2 && y1 === y2 && i1 === i2,
        ),
    );

    const gamesToUpdate = changedGames.reduce(
      (prev, game) => [
        ...prev,
        {
          gameId: game.i,
          timeSlotId: timeslots[game.y - 1].id,
          fieldId: fields[game.x - 1].id,
        },
      ],
      [],
    );

    const res = await api(`/api/entity/updateGamesInteractiveTool`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        games: gamesToUpdate,
      }),
    });

    if (res.status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      await getData();
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('changes_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
      setMadeChanges(false);
    }
  };

  const handleBack = () => {
    madeChanges ? setAlertDialog(true) : goBack();
  };
  const handleDialogSubmit = () => {
    goBack();
  };
  const handleDialogCancel = () => {
    setAlertDialog(false);
  };

  const handleMoveMode = () => {
    setIsAddingGames(false);
    setButtonsAdd([]);
    setLayout(layout.filter(item => item.i[0] !== '+'));
  };

  const handleAddMode = () => {
    setIsAddingGames(true);
    const buttonsToAdd = [];
    for (let x = 1; x < fields.length + 1; x++) {
      for (let y = 1; y < timeslots.length + 1; y++) {
        if (!layout.find(item => item.x === x && item.y === y)) {
          buttonsToAdd.push({
            i: `+${x}:${y}`,
            x: x,
            y: y,
            w: 1,
            h: 1,
            static: true,
          });
        }
      }
    }

    setButtonsAdd(buttonsToAdd);
    setLayout(layout.concat(buttonsToAdd));
  };

  const handleAddGameAt = (x, y) => {
    setAddGameField({
      id: fields[x - 1].id,
      name: fields[x - 1].field,
    });
    setAddGameTimeslot({
      id: timeslots[y - 1].id,
      date: timeslots[y - 1].date,
    });
    setAddGameDialog(true);
  };

  const createCard = game => {
    const gridX = fields.findIndex(f => f.id === game.field_id) + 1;
    const gridY =
      timeslots.findIndex(ts => ts.id === game.timeslot_id) + 1;

    // add game
    setGames(
      games.concat([
        {
          ...game,
          x: gridX,
          y: gridY,
        },
      ]),
    );

    // remove old "+" button
    setButtonsAdd(
      buttonsAdd.filter(btn => btn.i !== `+${gridX}:${gridY}`),
    );

    // set new layout
    setLayout(
      layout
        .filter(item => item.i !== `+${gridX}:${gridY}`)
        .concat([
          {
            i: game.id,
            x: gridX,
            y: gridY,
            w: 1,
            h: 1,
            isBounded: true,
          },
        ]),
    );
  };

  const AddGames = buttonsAdd.map(b => (
    <div
      className={styles.divAddGame}
      key={b.i}
      onClick={() => handleAddGameAt(b.x, b.y)}
    >
      <Icon icon="Add" color="#18b393" />
    </div>
  ));

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
      <div className={styles.divGrid}>
        <ReactGridLayout
          className={styles.gridLayout}
          width={(fields?.length + 1) * 192}
          cols={fields?.length + 1}
          rowHeight={64}
          maxRows={timeslots?.length + 1}
          compactType={null}
          margin={[20, 20]}
          onDragStop={onDragStop}
          layout={layout}
          useCSSTransforms
          preventCollision
          isResizable={false}
        >
          <div className={styles.divAdd} key="empty" />
          {Fields}
          {Times}
          {Games}
          {AddGames}
        </ReactGridLayout>
      </div>
      <Tooltip title={t('back')}>
        <Fab
          color="primary"
          onClick={handleBack}
          className={classes.fabBack}
        >
          <Icon icon="ArrowBack" />
        </Fab>
      </Tooltip>
      {isAddingGames ? (
        <Tooltip title={t('move_mode')}>
          <Fab onClick={handleMoveMode} className={classes.fabAdd}>
            <Icon icon="OpenWith" />
          </Fab>
        </Tooltip>
      ) : (
        <Tooltip title={t('add_mode')}>
          <Fab onClick={handleAddMode} className={classes.fabAdd}>
            <Icon icon="Add" />
          </Fab>
        </Tooltip>
      )}
      <Tooltip title={madeChanges ? t('cancel') : ''}>
        <Fab
          color="secondary"
          onClick={handleCancel}
          className={classes.fabCancel}
          disabled={!madeChanges}
        >
          <Icon icon="Cancel" />
        </Fab>
      </Tooltip>
      <Tooltip title={madeChanges ? t('save') : ''}>
        <Fab
          color="primary"
          onClick={handleSave}
          className={classes.fabSave}
          disabled={!madeChanges}
        >
          <Icon icon="SaveIcon" />
        </Fab>
      </Tooltip>
      <AlertDialog
        open={alertDialog}
        onSubmit={handleDialogSubmit}
        onCancel={handleDialogCancel}
        description={t('quit_interactive_tool_confirmation')}
        title={t('quit_interactive_tool')}
      />
      <AddGame
        eventId={eventId}
        isOpen={addGameDialog}
        onClose={() => setAddGameDialog(false)}
        createCard={createCard}
        field={addGameField}
        timeslot={addGameTimeslot}
        phases={phases}
        teams={teams}
      />
    </div>
  );
}
