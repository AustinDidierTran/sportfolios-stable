import React from 'react';

import { EntityList } from '../../../components/Custom';

import styles from './People.module.css';
import { ENTITIES_TYPE_ENUM } from '../../../../../common/enums';

export default function People() {
  return (
    <div className={styles.card}>
      <EntityList type={ENTITIES_TYPE_ENUM.PERSON} />
    </div>
  );
}
