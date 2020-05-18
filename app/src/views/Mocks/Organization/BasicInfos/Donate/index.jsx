import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Donate.module.css';

import { Container, Button } from '../../../../../components/MUI';

export default function BecomeMember(props) {
  const { t } = useTranslation();

  const handleClick = () => {
    console.log('Thanks for your donation!');
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      className={styles.button}
    >
      {t('donate')}
    </Button>
  );
}
