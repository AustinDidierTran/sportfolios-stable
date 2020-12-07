import React, { useEffect, useMemo, useState } from 'react';
import { Button, Icon } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../../MUI';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

import styles from './SubmitScoreSpiritForm.module.css';
import SectionScore from './SectionScore';
import SectionSpirit from './SectionSpirit';
import SectionPresences from './SectionPresences';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';

export default function SubmitScoreDialog(props) {
  const { open, onClose, gameId, submissionerInfos } = props;
  const { t } = useTranslation();

  const getData = async () => {
    const { data } = await api(
      formatRoute('/api/entity/gameSubmissionInfos', null, {
        gameId,
        rosterId: submissionerInfos.myTeam.rosterId,
      }),
    );
    setsubmissionInfos(data);
  };

  const [submissionInfos, setsubmissionInfos] = useState({});

  const personName = useMemo(
    () => submissionerInfos?.person?.completeName || '',
    [submissionerInfos?.person],
  );
  const teamName = useMemo(
    () => submissionerInfos?.myTeam?.name || '',
    [submissionerInfos?.myTeam],
  );

  useEffect(() => {
    if (open) {
      getData();
    }
  }, [open]);

  const SubmittedCheck = (
    <div className={styles.submitted}>
      <Typography className={styles.submitText}>
        {t('submitted')}
      </Typography>
      <Icon icon="CheckCircleOutline" color="#54AF51" />
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth={'xs'}
      fullWidth
    >
      <DialogTitle id="form-dialog-title">
        {t('submit_score')}
      </DialogTitle>
      <div>
        <DialogContent>
          <DialogContentText>
            {t('submitting_as_for', {
              person: personName,
              team: teamName,
            })}
          </DialogContentText>

          <SectionScore
            gameId={gameId}
            IsSubmittedCheck={SubmittedCheck}
            suggestions={submissionInfos?.scoreSuggestions}
            submissionerInfos={submissionerInfos}
          />
          <SectionSpirit
            gameId={gameId}
            IsSubmittedCheck={SubmittedCheck}
            submittedSpirit={submissionInfos?.spiritSubmission}
            submissionerInfos={submissionerInfos}
          />
          <SectionPresences
            gameId={gameId}
            IsSubmittedCheck={SubmittedCheck}
            submittedAttendances={submissionInfos?.presences}
            submissionerInfos={submissionerInfos}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t('close')}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
