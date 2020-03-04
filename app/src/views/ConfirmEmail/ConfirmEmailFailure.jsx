import React from 'react';
import { Link } from 'react-router-dom'

import Container from '@material-ui/core/Container';
import styles from './ConfirmEmail.module.css';

export default function ConfirmEmail(props) {
  return (
    <div className={styles.main}>
      <Container>
        <p>
          Email confirmation failed, please contact an administrator.
        </p>
      </Container>
    </div>
  );
}
