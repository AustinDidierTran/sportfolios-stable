import React, { useEffect, useMemo, useState } from 'react';
import { Button, Icon } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '../../../MUI';
import { ERROR_ENUM } from '../../../../../../common/errors';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import styles from './SubmitScoreSpiritForm.module.css';
import SectionScore from './SectionScore';
import SectionSpirit from './SectionSpirit';
import SectionPresences from './SectionPresences';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';

export default function SubmitScoreDialog(props) {
  const { open, onClose, game, submissionerGameInfos } = props;
  const { t } = useTranslation();

  const getData = async () => {
    const { data } = await api(
      formatRoute('/api/entity/gameSubmissionInfos', null, {
        gameId: game.id,
      }),
    );
    //console.log({ data });
    setsubmissionInfos(data);
  };

  const [submissionInfos, setsubmissionInfos] = useState({});

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
          <SectionScore
            game={game}
            IsSubmittedCheck={SubmittedCheck}
            suggestion={submissionInfos?.scoreSuggestion}
            submissioner={submissionerGameInfos}
          />
          <SectionSpirit
            game={game}
            IsSubmittedCheck={SubmittedCheck}
            submittedSpirit={submissionInfos?.spiritSubmission}
            submissioner={submissionerGameInfos}
          />
          <SectionPresences
            game={game}
            IsSubmittedCheck={SubmittedCheck}
            submittedPresences={submissionInfos?.presences}
            submissioner={submissionerGameInfos}
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
