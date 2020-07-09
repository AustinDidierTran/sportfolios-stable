import React from 'react';

import { EntityList } from '../../../components/Custom';

import styles from './People.module.css';
import { GLOBAL_ENUM } from '../../../../../common/enums';

export default function People() {
  return (
    <div className={styles.card}>
      <EntityList type={GLOBAL_ENUM.PERSON} />
    </div>
  );
}
