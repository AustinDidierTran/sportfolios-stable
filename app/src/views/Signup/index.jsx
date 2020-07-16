import React from 'react';

import styles from './Signup.module.css';

import { Container } from '../../components/Custom';
import SignupCard from './SignupCard';
// import DescriptionCard from './DescriptionCard';
import logo from '../../img/bigLogo.png';

export default function Signup() {
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <img className={styles.img} src={logo} />
        </div>
        <SignupCard />
      </Container>
    </div>
  );
}
