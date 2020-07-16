import React from 'react';

import styles from './Login.module.css';

import { Container } from '../../components/Custom';
import LoginCard from './LoginCard';
//import DescriptionCard from './DescriptionCard';
import SignupCard from './SignupCard';
import { Typography } from '../../components/MUI';
import logo from '../../img/bigLogo.png';

export default function Login() {
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <img className={styles.img} src={logo} />
        </div>

        <LoginCard />
        <div className={styles.or}>
          <Typography style={{ fontSize: 12 }}>OR</Typography>
        </div>

        <SignupCard />
      </Container>
    </div>
  );
}
