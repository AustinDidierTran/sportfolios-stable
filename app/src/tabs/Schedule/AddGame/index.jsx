import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/Custom';
import { TextField } from '../../../components/MUI';
import styles from './AddGame.module.css';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ERROR_ENUM } from '../../../../../common/errors';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import moment from 'moment';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen } = props;

  const { id: eventId } = useParams();

  const [open, setOpen] = useState(open);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onCancel = () => {
    setOpen(false);
  };

  const validate = values => {
    const { phase, time } = values;
    const errors = {};
    if (!time.length) {
      errors.time = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (phase.length > 64) {
      errors.phase = t(ERROR_ENUM.VALUE_IS_TOO_LONG);
    }
    if (!phase.length) {
      errors.phase = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      phase: '',
      field: '',
      time: '',
      team1: '',
      team2: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { phase, field, time, team1, team2 } = values;
      console.log({ phase, field, time, team1, team2 });
      const realTime = new Date(`2020-01-01 ${time}`).getTime();
      await api('/api/entity/game', {
        method: 'POST',
        body: JSON.stringify({
          field,
          time: realTime,
          team1,
          team2,
        }),
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Game 1</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <DialogContent>
            <DialogContentText>
              Create your game here
            </DialogContentText>
            <TextField
              formik={formik}
              namespace="phase"
              autoFocus
              margin="dense"
              id="phase"
              label="Phase"
              type="phase"
              fullWidth
            />
            <TextField
              formik={formik}
              namespace="field"
              autoFocus
              margin="dense"
              id="field"
              label={t('field')}
              type="field"
              fullWidth
            />
            <TextField
              formik={formik}
              namespace="time"
              autoFocus
              margin="dense"
              id="time"
              type="time"
              fullWidth
            />
            <TextField
              formik={formik}
              namespace="team1"
              autoFocus
              margin="dense"
              id="team1"
              label={t('team_1')}
              type="team1"
              fullWidth
            />
            <TextField
              formik={formik}
              namespace="team2"
              autoFocus
              margin="dense"
              id="team2"
              label={t('team_2')}
              type="team2"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              className={styles.button}
              onClick={onCancel}
              color="secondary"
              endIcon="Close"
            >
              {t('finish')}
            </Button>
            <Button
              color="primary"
              endIcon="Add"
              className={styles.button}
              type="submit"
            >
              {t('add_game')}
            </Button>
          </DialogActions>
        </div>
      </form>
    </Dialog>
  );
}
