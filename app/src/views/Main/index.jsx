import React from 'react';

import styles from './Main.module.css';
import { Card, CardContent, TextField } from '../../components/MUI';

export default function Main() {
  return (
    <div className={styles.main}>
      <Card>
        <CardContent>
          <h1>Heyyy</h1>
        </CardContent>
      </Card>
    </div>
  );
}
