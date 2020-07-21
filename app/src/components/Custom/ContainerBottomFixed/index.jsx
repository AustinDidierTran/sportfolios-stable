import React from 'react';
import styles from './ContainerBottomFixed.module.css';

export default function CartIcon(props) {
  const { children } = props;
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
