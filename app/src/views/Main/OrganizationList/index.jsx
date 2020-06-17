import React from 'react';

import { LIST_ROW_TYPE_ENUM } from '../../../../../common/enums';
import EntityList from '../../../components/Custom/EntityList';

export default function OrganizationList() {
  return <EntityList type={LIST_ROW_TYPE_ENUM.ORGANIZATION} />;
}
