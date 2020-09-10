import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/Custom';
import MUIButton from '@material-ui/core/Button';
import styles from './Games.module.css';
import { SELECT_ENUM } from '../../../../../common/enums';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import moment from 'moment';
import TeamSelect from './TeamSelect';
import PhaseSelect from './PhaseSelect';
import FieldSelect from './FieldSelect';
import TimeSlotSelect from './TimeSlotSelect';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { formatDate } from '../../../utils/stringFormats';
import { Typography } from '@material-ui/core';
import ChangeGame from './ChangeGame';

export default function Games(props) {
  const { role } = props;
  const { id: eventId } = useParams();
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [teamName, setTeamName] = useState(SELECT_ENUM.NONE);
  const [phaseId, setPhaseId] = useState(SELECT_ENUM.NONE);
  const [phaseName, setPhaseName] = useState('');
  const [field, setField] = useState(SELECT_ENUM.NONE);
  const [timeSlot, setTimeSlot] = useState(SELECT_ENUM.NONE);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(false);

  useEffect(() => {
    getGames();
  }, [eventId]);

  useEffect(() => {
    filter();
    getDescription();
  }, [teamName, phaseId, field, timeSlot]);

  const sortGames = games => {
    const res = games.sort(
      (a, b) => moment(a.start_time) - moment(b.start_time),
    );
    return res;
  };

  const getGames = async () => {
    const { data } = await api(
      formatRoute('/api/entity/games', null, { eventId }),
    );
    const res = sortGames(data);
    setGames(res);
    return res;
  };

  const changeTeamName = teamName => {
    setTeamName(teamName);
  };

  const changePhaseId = phase => {
    const { value, display } = phase;
    setPhaseId(value);
    setPhaseName(display);
  };

  const changeField = field => {
    setField(field);
  };

  const changeTimeSlot = timeSlot => {
    setTimeSlot(timeSlot);
  };

  const filter = async () => {
    let games = await getGames();
    if (teamName != SELECT_ENUM.NONE) {
      games = games.filter(game =>
        game.teams.some(team => team.name === teamName),
      );
    }
    if (phaseId != SELECT_ENUM.NONE) {
      games = games.filter(game => game.phase_id === phaseId);
    }
    if (field != SELECT_ENUM.NONE) {
      games = games.filter(game => game.field === field);
    }
    if (timeSlot != SELECT_ENUM.NONE) {
      games = games.filter(game => game.start_time === timeSlot);
    }
    setGames(games);
  };

  const getDescription = () => {
    let description = t('games');
    if (
      teamName === SELECT_ENUM.NONE &&
      phaseId === SELECT_ENUM.NONE &&
      field === SELECT_ENUM.NONE &&
      timeSlot === SELECT_ENUM.NONE
    ) {
      description = null;
    }
    if (teamName != SELECT_ENUM.NONE) {
      description = description + ` ${t('of_team')} ${teamName}`;
    }
    if (phaseId != SELECT_ENUM.NONE) {
      description = description + ` ${t('of')} ${phaseName}`;
    }
    if (field != SELECT_ENUM.NONE) {
      description = description + ` ${t('on')} ${field}`;
    }
    if (timeSlot != SELECT_ENUM.NONE) {
      description =
        description +
        ` ${t('at')} ${formatDate(moment(timeSlot), 'h:mm ddd')}`;
    }
    setDescription(description);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const update = () => {
    getGames();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
        className={styles.dialog}
        maxWidth={'xs'}
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          {t('filters')}
        </DialogTitle>
        <div>
          <DialogContent>
            <div className={styles.select}>
              <PhaseSelect onChange={changePhaseId} />
              <FieldSelect onChange={changeField} />
              <TimeSlotSelect onChange={changeTimeSlot} />
            </div>
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <MUIButton onClick={closeDialog} color="primary">
              {t('finish')}
            </MUIButton>
          </DialogActions>
        </div>
      </Dialog>
      <TeamSelect onChange={changeTeamName} />
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
        onClick={openDialog}
        className={styles.button}
      >
        {t('advanced_filters')}
      </Button>
      <Typography>{description}</Typography>
      <div className={styles.main} style={{ marginTop: '16px' }}>
        {games.map(game => (
          <ChangeGame update={update} role={role} game={game} />
        ))}
      </div>
    </>
  );
}
