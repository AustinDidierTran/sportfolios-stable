import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organisations.module.css';
import { TextField } from '../../../../../components/MUI';
import { IconButton, Tooltip } from '@material-ui/core';
import Add from '@material-ui/icons/AddCircle';

export default function Organisations(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <TextField
        namespace="Organisations"
        label={t('new_organisation')}
        className={styles.TextField}
      />
      <Tooltip title="Add new organisation to your account">
        <IconButton size="small" type="submit">
          <Add size="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
