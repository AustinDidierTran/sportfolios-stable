import React from 'react';
import { Paper } from '../../components/Custom';
import BasicInfos from '../../views/Entity/BasicInfos';
import styles from './About.module.css';

export default function TabAbout(props) {
  const { basicInfos } = props;

  return (
    <Paper className={styles.card}>
      <BasicInfos basicInfos={basicInfos} />
    </Paper>
  );
}
