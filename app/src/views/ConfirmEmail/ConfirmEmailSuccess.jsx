import React from 'react';
import { Link } from 'react-router-dom'

import { Container } from '../../components/MUI';

import styles from './ConfirmEmail.module.css';

export default function ConfirmEmailSuccess(props) {
  return (
    <div className={styles.main}>
      <Container>
        <p>
          Email successfully confirmed! You can now login <Link to='/login'>
            here</Link>
        </p>
      </Container>
    </div>
  );
}
