import React, { useState, useEffect } from 'react';

import { Paper, Button } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
// import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import styles from './Description.module.css';

export default function Description() {
  const { t } = useTranslation();

  const { id: eventId } = useParams();

  const [edit, setEdit] = useState(false);

  const [text, setText] = useState('');

  const [temp, setTemp] = useState('');

  useEffect(() => {
    getDescription();
  }, [eventId]);

  useEffect(() => {
    console.log({ text });
  }, [text]);

  const getDescription = async () => {
    const { data } = await api(
      `/api/entity/generalInfos?entityId=${eventId}`,
    );
    if (data.description) {
      setText(decodeURIComponent(data.description));
    } else {
      setText(data.description);
    }
  };

  const updateDescription = async description => {
    await api('/api/entity/updateGeneralInfos', {
      method: 'PUT',
      body: JSON.stringify({ description, entityId: eventId }),
    });
    getDescription();
  };

  const onEdit = () => {
    setEdit(true);
  };
  const onSave = () => {
    updateDescription(temp);
    setEdit(false);
  };

  const onCancel = () => {
    setEdit(false);
  };

  const onChange = () => {
    const encoded = encodeURIComponent(event.target.value);
    setTemp(encoded);
  };

  if (edit) {
    return (
      <Paper title="Description">
        <TextareaAutosize
          className={styles.textareaEdit}
          placeholder="Description"
          value={text}
          onChange={onChange}
        />
        <Button
          size="small"
          variant="contained"
          endIcon="Check"
          style={{ margin: '8px' }}
          onClick={onSave}
        >
          {t('save')}
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          endIcon="Close"
          style={{ margin: '8px' }}
          onClick={onCancel}
        >
          {t('cancel')}
        </Button>
      </Paper>
    );
  }
  if (text) {
    return (
      <Paper title="Description">
        <TextareaAutosize
          className={styles.textarea}
          placeholder="Description"
          value={text}
          disabled
        />
        <Button
          size="small"
          variant="contained"
          endIcon="Edit"
          style={{ margin: '8px' }}
          onClick={onEdit}
        >
          {t('edit')}
        </Button>
      </Paper>
    );
  }

  return (
    <Paper title="Description">
      <Typography>{t('no_description')}</Typography>
      <Button
        size="small"
        variant="contained"
        endIcon="Edit"
        style={{ margin: '8px' }}
        onClick={onEdit}
      >
        {t('edit')}
      </Button>
    </Paper>
  );
}
