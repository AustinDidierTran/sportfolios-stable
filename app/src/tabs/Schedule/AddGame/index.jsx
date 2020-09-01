import React, { useState, useEffect, useContext } from 'react';
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
import api from '../../../actions/api';
import { Store, ACTION_ENUM } from '../../../Store';
import { SEVERITY_ENUM } from '../../../../../common/enums';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen } = props;
  const { dispatch } = useContext(Store);

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
    onSubmit: async (values, { resetForm }) => {
      const { field, time, team1, team2 } = values;
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
      resetForm();
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('game_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
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
              {t('create_a_game')}
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
              color="grey"
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
