import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Donate.module.css';

import { IconButton } from '../../../../../components/MUI';
import { Button } from '../../../../../components/Custom';

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
      endIcon="AttachMoney"
    >
      {t('donate')}
    </Button>
  );
}
