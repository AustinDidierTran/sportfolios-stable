import React from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Container } from '../../components/MUI';
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
        <Card
          style={{
            width: '100%',
            paddingLeft: '16px',
            marginTop: '32px',
          }}
        >
          <p>{t('email_confirmed', { email })}</p>
        </Card>
      </Container>
    </div>
  );
}
