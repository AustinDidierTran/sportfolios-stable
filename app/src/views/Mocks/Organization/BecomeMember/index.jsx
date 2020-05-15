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

  return (
    <Container className={styles.container}>
      {isMember ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          {t('your_a_member')}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClick}
        >
          {t('become_member')}
        </Button>
      )}
    </Container>
  );
}
