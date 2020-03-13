import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Tabs.module.css';

export default function Tabs() {
  return (
    <div className={styles.tabs}>
      <Link to={'/'} className={styles.navLink}>
        Home
      </Link>
      <Link to={'/login'} className={styles.navLink}>
        Login
      </Link>
    </div>
  );
}
