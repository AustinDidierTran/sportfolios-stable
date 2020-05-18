import React from 'react';

import styles from './Signup.module.css';

import { Container } from '../../components/MUI';
import SignupCard from './SignupCard';
import DescriptionCard from './DescriptionCard';

export default function Signup() {
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <DescriptionCard />
        <SignupCard />
      </Container>
    </div>
  );
}
