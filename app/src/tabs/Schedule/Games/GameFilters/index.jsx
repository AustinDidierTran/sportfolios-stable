import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/Custom';
import MUIButton from '@material-ui/core/Button';
import styles from './GameFilters.module.css';
import { SELECT_ENUM } from '../../../../../../common/enums';
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
import { formatDate } from '../../../../utils/stringFormats';
import { Typography } from '@material-ui/core';

export default function GameFilters(props) {
  const { update } = props;
  const { t } = useTranslation();
  const [teamName, setTeamName] = useState(SELECT_ENUM.ALL);
  const [phaseId, setPhaseId] = useState(SELECT_ENUM.ALL);
  const [phaseName, setPhaseName] = useState('');
  const [field, setField] = useState(SELECT_ENUM.ALL);
  const [timeSlot, setTimeSlot] = useState(SELECT_ENUM.ALL);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(false);

  useEffect(() => {
    update(teamName, phaseId, field, timeSlot);
    getDescription();
  }, [teamName, phaseId, field, timeSlot]);

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

  const getDescription = () => {
    let description = t('games');
    if (
      teamName === SELECT_ENUM.ALL &&
      phaseId === SELECT_ENUM.ALL &&
      field === SELECT_ENUM.ALL &&
      timeSlot === SELECT_ENUM.ALL
    ) {
      description = null;
    }
    if (teamName != SELECT_ENUM.ALL) {
      description = description + ` ${t('of_team')} ${teamName}`;
    }
    if (phaseId != SELECT_ENUM.ALL) {
      description = description + ` ${t('of')} ${phaseName}`;
    }
    if (field != SELECT_ENUM.ALL) {
      description = description + ` ${t('on')} ${field}`;
    }
    if (timeSlot != SELECT_ENUM.ALL) {
      description =
        description +
        ` ${t('on_le_in_french')} ${formatDate(
          moment(timeSlot),
          'DD MMM',
        )}`;
    }
    setDescription(description);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
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
              <PhaseSelect
                onChange={changePhaseId}
                phaseId={phaseId}
              />
              <FieldSelect onChange={changeField} field={field} />
              <TimeSlotSelect
                onChange={changeTimeSlot}
                timeSlot={timeSlot}
              />
              <TeamSelect
                onChange={changeTeamName}
                teamName={teamName}
              />
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
      <TeamSelect onChange={changeTeamName} teamName={teamName} />
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
      <Typography style={{ marginTop: '16px' }}>
        {description}
      </Typography>
    </>
  );
}
