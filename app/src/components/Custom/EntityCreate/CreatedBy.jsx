import React from 'react';
import { Typography } from '../../MUI';
import { useTranslation } from 'react-i18next';

export default function CreatedBy(props) {
  const { t } = useTranslation();
  const { name } = props;

  if (!name) {
    return <></>;
  }

  return (
    <Typography style={{ marginLeft: 16, marginTop: 16 }}>
      {t('created_by', { name })}
    </Typography>
  );
}
