import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import {
  Paper,
  IgContainer,
  IconButton,
} from '../../components/Custom';
import MembersReport from './MembersReport';
import SalesReport from './SalesReport';
import { ListItemText } from '@material-ui/core';
import styles from './CreateReport.module.css';

export default function CreateReport() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('create_report'));
  }, []);

  return (
    <IgContainer>
      <Paper
        style={{ textAlign: 'center' }}
        title={t('generate_report')}
      >
        <div className={styles.header}>
          <IconButton
            icon="ArrowBack"
            onClick={() => {
              history.back();
            }}
            tooltip={t('back')}
            style={{ color: 'primary', margin: '8px' }}
          />
          <ListItemText
            primary={t('choose_your_report')}
            className={styles.title}
          />
        </div>
        <MembersReport />
        <SalesReport />
      </Paper>
    </IgContainer>
  );
}
