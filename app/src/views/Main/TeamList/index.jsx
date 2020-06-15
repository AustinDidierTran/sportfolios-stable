import React from 'react';

import { ENTITIES_TYPE_ENUM } from '../../../../../common/enums';
import EntityList from '../../../components/Custom/EntityList';

export default function TeamList() {
  return <EntityList type={ENTITIES_TYPE_ENUM.TEAM} />;
}
