import React from 'react';

import styles from './IgContainer.module.css';

export default function IgContainer(props) {
  const { className, children } = props;
  return (
    <div
      className={
        className ? [className, styles.main].join(' ') : styles.main
      }
    >
      {children}
    </div>
  );
}
