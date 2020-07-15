import React, { useState, useEffect } from 'react';

import { Paper } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../../actions/goTo';
import api from '../../../actions/api';
import { useParams } from 'react-router-dom';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import styles from './Description.module.css';

export default function Description() {
  const { t } = useTranslation();

  const { id: eventId } = useParams();

  const [text, setText] = useState('');

  useEffect(() => {
    getDescription();
  }, [eventId]);

  const getDescription = async () => {
    const { data } = await api(
      formatRoute('/api/entity/generalInfos', null, {
        entityId: eventId,
      }),
    );
    if (data.description) {
      setText(decodeURIComponent(data.description));
    } else {
      setText(null);
    }
  };

  if (text) {
    return (
      <Paper title="Description">
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
    <Paper title="Description">
      <Typography style={{ margin: '8px' }}>
        {t('no_description')}
      </Typography>
    </Paper>
  );
}
