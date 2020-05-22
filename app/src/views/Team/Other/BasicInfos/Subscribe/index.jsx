import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Subscribe.module.css';

import { Container, Button } from '../../../../../components/MUI';

export default function Subscribe(props) {
  const { t } = useTranslation();

  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleClick = () => {
    setIsSubscribe(!isSubscribe);
  };

  return isSubscribe ? (
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
