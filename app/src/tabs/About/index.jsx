import React from 'react';
import { Paper } from '../../components/Custom';
import { useAdmin, useEditor } from '../../hooks/roles';
import styles from './About.module.css';
import { GLOBAL_ENUM } from '../../../../common/enums';
import loadable from '@loadable/component';

const BasicInfos = loadable(() =>
  import('../../views/Entity/BasicInfos'),
);
const Memberships = loadable(() => import('./Memberships'));

export default function TabAbout(props) {
  const { basicInfos } = props;

  const { role = ENTITIES_ROLE_ENUM.VIEWER, type } = basicInfos;
  const isEditor = useEditor(role);

  const isAdmin = useAdmin(role);

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
      if (isEditor || isAdmin) {
        return (
          <Paper className={styles.card}>
            <BasicInfos basicInfos={basicInfos} />
          </Paper>
        );
      } else {
        return (
          <Paper className={styles.card}>
            <BasicInfos basicInfos={basicInfos} />
            <Memberships />
          </Paper>
        );
      }

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
