import React from 'react';
import loadable from '@loadable/component';

import { formatRoute } from '../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { useApiRoute } from '../../hooks/queries';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/Custom';

const EntityNotFound = loadable(() => import('./EntityNotFound'));
const Event = loadable(() => import('./Event'));
const Organization = loadable(() => import('./Organization'));
const Person = loadable(() => import('./Person'));
const Team = loadable(() => import('./Team'));

const EntityMap = {
  [GLOBAL_ENUM.PERSON]: Person,
  [GLOBAL_ENUM.ORGANIZATION]: Organization,
  [GLOBAL_ENUM.TEAM]: Team,
  [GLOBAL_ENUM.EVENT]: Event,
};

export default function Entity() {
  const { id } = useParams();

  const { response: basicInfos, isLoading } = useApiRoute(
    formatRoute('/api/entity', null, { id }),
    {
      defaultValue: {},
    },
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!basicInfos) {
    return <EntityNotFound />;
  }

  const EntityObject = EntityMap[basicInfos.type];

  if (!EntityObject) {
    return <EntityNotFound />;
  }
  return <EntityObject basicInfos={basicInfos} />;
}
