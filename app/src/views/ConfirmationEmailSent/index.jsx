import React from 'react';
import { useTranslation } from 'react-i18next';

import { Container } from '../../components/Custom';
import styles from './ConfirmationEmailSent.module.css';

export default function ConfirmationEmailSent(props) {
  const {
    match: {
      params: { email },
    },
  } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <Container>
        <div className={styles.container}>
          <p>{t('email_confirmed', { email })}</p>
        </div>
      </Container>
    </div>
  );
}
