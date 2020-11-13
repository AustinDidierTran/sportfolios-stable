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
  const [teamId, setTeamId] = useState(SELECT_ENUM.ALL);
  const [teamName, setTeamName] = useState('');
  const [phaseId, setPhaseId] = useState(SELECT_ENUM.ALL);
  const [phaseName, setPhaseName] = useState('');
  const [fieldId, setFieldId] = useState(SELECT_ENUM.ALL);
  const [fieldName, setFieldName] = useState('');
  const [timeSlot, setTimeSlot] = useState(SELECT_ENUM.ALL);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(false);

  useEffect(() => {
    update(teamId, phaseId, fieldId, timeSlot);
    getDescription();
  }, [teamId, phaseId, fieldId, timeSlot]);

  const changeTeam = team => {
    const { value, display } = team;
    setTeamId(value);
    setTeamName(display);
  };

  const changePhaseId = phase => {
    const { value, display } = phase;
    setPhaseId(value);
    setPhaseName(display);
  };

  const changeFieldId = field => {
    const { value, display } = field;
    setFieldId(value);
    setFieldName(display);
  };

  const changeTimeSlot = timeSlot => {
    setTimeSlot(timeSlot);
  };

  const getDescription = () => {
    let description = t('games');
    if (
      teamId === SELECT_ENUM.ALL &&
      phaseId === SELECT_ENUM.ALL &&
      fieldId === SELECT_ENUM.ALL &&
      timeSlot === SELECT_ENUM.ALL
    ) {
      description = null;
    }
    if (teamId != SELECT_ENUM.ALL) {
      description = description + ` ${t('of_team')} ${teamName}`;
    }
    if (phaseId != SELECT_ENUM.ALL) {
      description = description + ` ${t('of')} ${phaseName}`;
    }
    if (fieldId != SELECT_ENUM.ALL) {
      description = description + ` ${t('on')} ${fieldName}`;
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

  const clearAll = () => {
    setTeamId(SELECT_ENUM.ALL);
    setTeamName('');
    setPhaseId(SELECT_ENUM.ALL);
    setPhaseName('');
    setFieldId(SELECT_ENUM.ALL);
    setFieldName('');
    setTimeSlot(SELECT_ENUM.ALL);
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
              <TeamSelect onChange={changeTeam} teamId={teamId} />
              <TimeSlotSelect
                onChange={changeTimeSlot}
                timeSlot={timeSlot}
              />
              <PhaseSelect
                onChange={changePhaseId}
                phaseId={phaseId}
              />
              <FieldSelect
                onChange={changeFieldId}
                fieldId={fieldId}
              />
            </div>
            <DialogContentText className={styles.description}>
              {description}
            </DialogContentText>
            <Button
              size="small"
              variant="contained"
              onClick={clearAll}
            >
              {t('clear_all')}
            </Button>
          </DialogContent>
          <DialogActions>
            <MUIButton onClick={closeDialog} color="primary">
              {t('finish')}
            </MUIButton>
          </DialogActions>
        </div>
      </Dialog>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
        onClick={openDialog}
      >
        {t('filters')}
      </Button>
      <Typography
        style={{ marginTop: '8px' }}
        variant="body2"
        color="textSecondary"
      >
        {description}
      </Typography>
    </>
  );
}
