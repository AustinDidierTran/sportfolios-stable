import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Subscribe.module.css';

import { Button } from '../../../../components/MUI';

export default function Subscribe() {
  const { t } = useTranslation();

  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleClick = () => {
    setIsSubscribed(!isSubscribed);
  };

  return isSubscribed ? (
    <Button
      variant="contained"
      onClick={handleClick}
      className={styles.button}
    >
      {t('subscribed')}
    </Button>
  ) : (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      className={styles.button}
    >
      {t('subscribe')}
    </Button>
  );
}
