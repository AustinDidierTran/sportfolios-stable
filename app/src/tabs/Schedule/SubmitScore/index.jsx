import React, { useState } from 'react';
import { Button, Icon } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
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
      <div className={styles.proTip}>
        {window.innerWidth < 768 ? (
          <></>
        ) : (
          <Icon icon="EmojiObjects" color="grey" />
        )}
        <Typography color="textSecondary" variant="body2">
          {t('you_can_also_click_on_your_game_to_submit_your_score')}
        </Typography>
      </div>
      <SubmitScoreDialog open={open} onClose={onClose} />
    </>
  );
}
