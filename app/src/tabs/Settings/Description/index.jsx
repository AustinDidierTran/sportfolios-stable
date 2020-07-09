import React, { useState } from 'react';

import { Paper, Button } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import styles from './Description.module.css';

export default function Description() {
  const { t } = useTranslation();

  const [edit, setEdit] = useState(false);

  const [text, setText] = useState('');

  const [temp, setTemp] = useState('');

  const onEdit = () => {
    setEdit(true);
  };
  const onSave = () => {
    setText(temp);
    setEdit(false);
  };

  const onCancel = () => {
    setEdit(false);
  };

  const onChange = () => {
    // TODO: Encode and decode value with the following code
    // const encoded = encodeURIComponent(event.target.value);
    // const decoded = decodeURIComponent(encoded);
    setTemp(event.target.value);
  };

  if (edit) {
    return (
      <Paper title="Description">
        <TextareaAutosize
          className={styles.textareaEdit}
          placeholder="Description"
          defaultValue={text}
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
          defaultValue={text}
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
