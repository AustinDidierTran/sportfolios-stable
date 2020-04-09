import React from 'react';
import { Link } from 'react-router-dom';

import { Container } from '../../components/MUI';

import styles from './ConfirmEmail.module.css';

export default function ConfirmEmail(props) {
  return (
    <div className={styles.main}>
      <Container>
        <p>
          Email confirmation failed, please contact an administrator.{' '}
          <Link to="/newConfirmationEmail">
            Click here to send a new confirmation email.
          </Link>
        </p>
      </Container>
    </div>
  );
}
