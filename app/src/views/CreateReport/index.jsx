import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';

import {
  Paper,
  IgContainer,
  IconButton,
} from '../../components/Custom';
import styles from './CreateReport.module.css';
import MembersWithDateReport from './MembersWithDateReport';

export default function CreateReport() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('create_report'));
  }, []);

  return (
    <IgContainer>
      <Paper
        style={{ textAlign: 'center' }}
        title={t('create_report')}
      >
        <div className={styles.button}>
          <IconButton
            icon="ArrowBack"
            onClick={() => {
              history.back();
            }}
            tooltip={t('back')}
            style={{ color: 'primary', margin: '8px' }}
          />
        </div>
        <MembersWithDateReport />
      </Paper>
    </IgContainer>
  );
}
