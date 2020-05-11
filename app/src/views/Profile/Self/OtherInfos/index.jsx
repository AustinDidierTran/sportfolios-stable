import React from 'react';

import Teams from './Teams';
import Organisations from './Organisations';
import History from './History';

import { Card } from '../../../../components/MUI';
import styles from './OtherInfos.module.css';
export default function selfProfile(props) {
  return (
    <Card className={styles.Card}>
      <Teams />
      <br />
      <Organisations />
      <br />
      <History />
    </Card>
  );
}
