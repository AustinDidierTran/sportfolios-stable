import React from 'react';

import styles from './Login.module.css';

import { Container } from '../../components/Custom';
import LoginCard from './LoginCard';
import DescriptionCard from './DescriptionCard';

export default function Login() {
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <DescriptionCard />
        <LoginCard />
      </Container>
    </div>
  );
}
