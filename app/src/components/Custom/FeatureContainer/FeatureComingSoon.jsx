import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FeatureComingSoon() {
  const { t } = useTranslation();
  return (
    <div>
      <p>{t('feature_coming_soon')}</p>
    </div>
  );
}
