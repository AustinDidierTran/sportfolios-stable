import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';

import {
  Paper,
  IgContainer,
  IconButton,
} from '../../components/Custom';
import MembersWithDateReport from './MembersWithDateReport';
import {
  ListItemText,
  ListItem,
  ListItemIcon,
} from '@material-ui/core';

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
        <ListItem>
          <ListItemIcon>
            <IconButton
              icon="ArrowBack"
              onClick={() => {
                history.back();
              }}
              tooltip={t('back')}
              style={{ color: 'primary', margin: '8px' }}
            />
          </ListItemIcon>
          <ListItemText primary={t('choose_your_report')} />
        </ListItem>
        <MembersWithDateReport />
      </Paper>
    </IgContainer>
  );
}
