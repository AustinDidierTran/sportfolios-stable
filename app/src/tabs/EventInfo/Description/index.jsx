import React, { useMemo } from 'react';

import { Paper } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import styles from './Description.module.css';

export default function Description(props) {
  const { t } = useTranslation();
  const { description } = props;

  const text = useMemo(
    () => (description ? decodeURIComponent(description) : ''),
    [description],
  );

  if (text && text != 'null') {
    return (
      <Paper className={styles.paper}>
        <TextareaAutosize
          className={styles.textarea}
          placeholder="Description"
          value={text}
          disabled
        />
      </Paper>
    );
  }

  return (
    <Paper className={styles.noDescription}>
      <Typography align="center" className={styles.typo}>
        {t('no_description')}
      </Typography>
    </Paper>
  );
}
