import React from 'react';

import { CircularProgress } from '@material-ui/core';
import { formatRoute } from '../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { useApiRoute } from '../../hooks/queries';
import { useParams } from 'react-router-dom';
import EntityNotFound from './EntityNotFound';
import Event from './Event';
import Organization from './Organization';
import Person from './Person';
import Team from './Team';

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
    return <CircularProgress />;
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
