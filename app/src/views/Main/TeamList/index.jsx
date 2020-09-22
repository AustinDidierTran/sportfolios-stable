import React from 'react';

import { EntityList } from '../../../components/Custom';
import { GLOBAL_ENUM } from '../../../../../common/enums';

export default function TeamList() {
  return <EntityList type={GLOBAL_ENUM.TEAM} />;
}
