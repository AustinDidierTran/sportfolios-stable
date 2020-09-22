import React, { useState } from 'react';
import { Button } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './SubmitScore.module.css';
import SubmitScoreDialog from './SubmitScoreDialog';

export default function SubmitScore() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        endIcon="Send"
        style={{ margin: '8px' }}
        onClick={onOpen}
        className={styles.button}
      >
        {t('submit_score')}
      </Button>
      <SubmitScoreDialog open={open} onClose={onClose} />
    </>
  );
}
