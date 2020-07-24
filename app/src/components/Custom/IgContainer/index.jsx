import React from 'react';

import styles from './IgContainer.module.css';
import { Container } from '..';

export default function IgContainer(props) {
  const { children } = props;
  return (
    <Container>
      <div className={styles.main}>{children}</div>
    </Container>
  );
}
