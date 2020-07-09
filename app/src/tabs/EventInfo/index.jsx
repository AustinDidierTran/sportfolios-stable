import React from 'react';

import { Paper } from '../../components/Custom';
import { useTranslation } from 'react-i18next';

export default function TabEventInfo() {
  const { t } = useTranslation();
  return (
    <Paper title={t('info')}>
      <p>These are tournament informations</p>
    </Paper>
  );
}
