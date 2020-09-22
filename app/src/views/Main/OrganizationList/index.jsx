import React from 'react';

import { GLOBAL_ENUM } from '../../../../../common/enums';
import EntityList from '../../../components/Custom/EntityList';

export default function OrganizationList() {
  return <EntityList type={GLOBAL_ENUM.ORGANIZATION} />;
}
