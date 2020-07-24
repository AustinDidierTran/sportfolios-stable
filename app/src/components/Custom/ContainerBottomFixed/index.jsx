import React from 'react';
import styles from './ContainerBottomFixed.module.css';

export default function ContainerBottomFixed(props) {
  const { children } = props;
  return <div className={styles.container}>{children}</div>;
}
