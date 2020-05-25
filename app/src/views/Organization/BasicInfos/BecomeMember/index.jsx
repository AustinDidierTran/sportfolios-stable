import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BecomeMember.module.css';

import { Container, Button } from '../../../../components/MUI';

export default function BecomeMember(props) {
  const { t } = useTranslation();

  const [isMember, setIsMember] = useState(false);

  const handleClick = () => {
    setIsMember(!isMember);
  };

  return isMember ? (
    <Button
      variant="contained"
      onClick={handleClick}
      className={styles.button}
    >
      {t('competitive_member')}
    </Button>
  ) : (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      className={styles.button}
    >
      {t('become_member')}
    </Button>
  );
}
