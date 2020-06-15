import React from 'react';

import EntityCreate from '../../../../components/Custom/EntityCreate';
import { ENTITIES_TYPE_ENUM } from '../..';

export default function CreateTeam() {
  return <EntityCreate type={ENTITIES_TYPE_ENUM.TEAM} />;
}
