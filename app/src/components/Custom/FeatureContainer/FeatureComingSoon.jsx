import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../MUI';

export default function FeatureComingSoon() {
  const { t } = useTranslation();
  return (
    <div>
      <Typography style={{ marginTop: '8px' }}>
        {t('feature_coming_soon')}
      </Typography>
    </div>
  );
}
