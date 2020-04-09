import React from 'react';

import { Container } from '../../components/MUI';
import BasicInfos from './BasicInfos';

import styles from './Profile.module.css';

export default function Profile(props) {
  return (
    <Container className={styles.container}>
      <BasicInfos />
    </Container>
  );
}
