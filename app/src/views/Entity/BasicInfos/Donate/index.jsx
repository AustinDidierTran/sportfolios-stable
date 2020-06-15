import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Donate.module.css';

import { Button } from '../../../../components/Custom';

export default function BecomeMember() {
  const { t } = useTranslation();

  const handleClick = () => {
    alert('Thanks for your donation!');
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      endIcon="AttachMoney"
      style={{ marginRight: '8px' }}
    >
      {t('donate')}
    </Button>
  );
}
