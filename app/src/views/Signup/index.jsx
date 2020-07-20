import React from 'react';

import styles from './Signup.module.css';

import { Container } from '../../components/Custom';
import SignupCard from './SignupCard';
import logo from '../../img/bigLogo.png';
import { useQuery } from '../../hooks/queries';

export default function Signup() {
  const { successRoute } = useQuery();
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <img className={styles.img} src={logo} />
        </div>
        <SignupCard successRoute={successRoute} />
      </Container>
    </div>
  );
}
