import React from 'react';

import styles from './General.module.css';

import UpcomingEvents from './UpcomingEvents';
export default function General() {
  return (
    <div className={styles.general}>
      <UpcomingEvents />
    </div>
  );
}
