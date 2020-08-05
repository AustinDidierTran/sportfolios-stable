import React, { useState, useEffect } from 'react';

import { Paper, Button } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../../actions/goTo';
import api from '../../../actions/api';
import { useParams } from 'react-router-dom';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import styles from './QuickDescription.module.css';

export default function QuickDescription() {
  const { t } = useTranslation();

  const { id: eventId } = useParams();

  const [edit, setEdit] = useState(false);

  const [text, setText] = useState('');

  const [temp, setTemp] = useState('');

  useEffect(() => {
    getQuickDescription();
  }, [eventId]);

  const getQuickDescription = async () => {
    const { data } = await api(
      formatRoute('/api/entity/generalInfos', null, {
        entityId: eventId,
      }),
    );

    if (data.quickDescription) {
      setText(decodeURIComponent(data.quickDescription));
      setTemp(decodeURIComponent(data.quickDescription));
    } else {
      setText(null);
    }
  };

  const updateQuickDescription = async temp => {
    const encoded = encodeURIComponent(temp);
    await api('/api/entity/updateGeneralInfos', {
      method: 'PUT',
      body: JSON.stringify({
        quickDescription: encoded,
        entityId: eventId,
      }),
    });
    getQuickDescription();
  };

  const onEdit = () => {
    setEdit(true);
  };
  const onSave = () => {
    updateQuickDescription(temp);
    setEdit(false);
  };

  const onCancel = () => {
    setEdit(false);
  };

  const onChange = () => {
    setTemp(event.target.value);
  };

  if (edit) {
    return (
      <Paper title={t('quick_description')}>
        <TextareaAutosize
          className={styles.textareaEdit}
          placeholder={t('quick_description')}
          defaultValue={text}
          onChange={onChange}
        />
        <div className={styles.buttons}>
          <Button
            className={styles.save}
            size="small"
            variant="contained"
            endIcon="Check"
            style={{ margin: '8px' }}
            onClick={onSave}
          >
            {t('save')}
          </Button>
          <Button
            className={styles.cancel}
            size="small"
            variant="contained"
            color="secondary"
            endIcon="Close"
            style={{ margin: '8px' }}
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
        </div>
      </Paper>
    );
  }
  if (text) {
    return (
      <Paper title={t('quick_description')}>
        <TextareaAutosize
          className={styles.textarea}
          placeholder={t('quick_description')}
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
    <Paper title={t('quick_description')}>
      <Typography>{t('no_description')}</Typography>
      <Button
        size="small"
        variant="contained"
        endIcon="Edit"
        style={{ margin: '8px' }}
        onClick={onEdit}
        className={styles.button}
      >
        {t('edit')}
      </Button>
    </Paper>
  );
}
