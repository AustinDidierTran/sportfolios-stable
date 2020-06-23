import React from 'react';

import Organization from './Organization';
import Person from './Person';
import { useParams } from 'react-router-dom';
import Team from './Team';
import { GLOBAL_ENUM } from '../../../../common/enums';
import EntityNotFound from './EntityNotFound';
import { formatRoute } from '../../actions/goTo';
import { CircularProgress } from '@material-ui/core';
import { useApiRoute } from '../../hooks/queries';

export default function Entity() {
  const { id } = useParams();

  const { response: basicInfos, isLoading } = useApiRoute(
    formatRoute('/api/entity', null, { id }),
    {
      defaultValue: { data: {} },
    },
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!basicInfos) {
    return <EntityNotFound />;
  }

  switch (Number(basicInfos.type)) {
    case GLOBAL_ENUM.PERSON:
      return <Person basicInfos={basicInfos} />;
    case GLOBAL_ENUM.ORGANIZATION:
      return <Organization basicInfos={basicInfos} />;
    case GLOBAL_ENUM.TEAM:
      return <Team basicInfos={basicInfos} />;
    case GLOBAL_ENUM.EVENT:
      return <Team basicInfos={basicInfos} />;
  }

  return <EntityNotFound />;
}
