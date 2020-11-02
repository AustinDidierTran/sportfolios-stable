import React from 'react';
import { Paper } from '../../components/Custom';
import styles from './About.module.css';
import { GLOBAL_ENUM } from '../../../../common/enums';
import loadable from '@loadable/component';

const BasicInfos = loadable(() => import('./BasicInfos'));
const Memberships = loadable(() => import('./Memberships'));

export default function TabAbout(props) {
  const { basicInfos } = props;

  const { type } = basicInfos;

  switch (type) {
    case GLOBAL_ENUM.TEAM:
      return (
        <Paper className={styles.card}>
          <BasicInfos basicInfos={basicInfos} />
        </Paper>
      );

    case GLOBAL_ENUM.EVENT:
      return (
        <Paper className={styles.card}>
          <BasicInfos basicInfos={basicInfos} />
        </Paper>
      );

    case GLOBAL_ENUM.ORGANIZATION:
      return (
        <Paper className={styles.card}>
          <BasicInfos basicInfos={basicInfos} />
          <Memberships />
        </Paper>
      );

    case GLOBAL_ENUM.PERSON:
      return (
        <Paper className={styles.card}>
          <BasicInfos basicInfos={basicInfos} />
        </Paper>
      );
    default:
      throw 'type not defined';
  }
}
