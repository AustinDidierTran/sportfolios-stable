import React from 'react';

import styles from './Login.module.css';

import { Container } from '../../components/Custom';
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';
import { Typography } from '../../components/MUI';
import logo from '../../img/bigLogo.png';
import { useTranslation } from 'react-i18next';
import { useQuery } from '../../hooks/queries';

export default function Login() {
  const { t } = useTranslation();
  const { successRoute } = useQuery();

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <img className={styles.img} src={logo} />
        </div>

        <LoginCard successRoute={successRoute || ''} />
        <div className={styles.or}>
          <Typography style={{ fontSize: 12 }}>{t('or')}</Typography>
        </div>

        <SignupCard successRoute={successRoute || ''} />
      </Container>
    </div>
  );
}
