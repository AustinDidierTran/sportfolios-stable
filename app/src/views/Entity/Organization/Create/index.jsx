import React from 'react';

import EntityCreate from '../../../../components/Custom/EntityCreate';
import { ENTITIES_TYPE_ENUM } from '../../../../../../common/enums';

export default function CreateOrganization() {
  return <EntityCreate type={ENTITIES_TYPE_ENUM.ORGANIZATION} />;
}
