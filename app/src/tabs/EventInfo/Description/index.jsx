import React, { useState, useEffect } from 'react';

import { Paper } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import styles from './Description.module.css';

export default function Description(props) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const { description } = props;

  useEffect(() => {
    setText(decodeURIComponent(description));
  }, [props]);

  if (text && text != 'null') {
    return (
      <Paper style={{ marginTop: 8 }} className={styles.paper}>
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
    <Paper className={styles.paper}>
      <Typography style={{ margin: '8px' }}>
        {t('no_description')}
      </Typography>
    </Paper>
  );
}
