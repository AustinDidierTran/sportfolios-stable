import React, { useState, useEffect } from 'react';

import Organization from './Organization';
import Person from './Person';
import api from '../../actions/api';
import { useParams } from 'react-router-dom';
import Team from './Team';
import { ENTITIES_TYPE_ENUM } from '../../../../common/enums';
import EntityNotFound from './EntityNotFound';

export default function Entity() {
  const { id } = useParams();
  const [basicInfos, setBasicInfos] = useState(null);

  const updateBasicInfos = async () => {
    const { data } = await api(`/api/entity?id=${id}`);

    setBasicInfos(data);
  };

  useEffect(() => {
    updateBasicInfos();
  }, [id]);

  return basicInfos ? (
    basicInfos.type === ENTITIES_TYPE_ENUM.PERSON ? (
      <Person basicInfos={basicInfos} />
    ) : basicInfos.type === ENTITIES_TYPE_ENUM.ORGANIZATION ? (
      <Organization basicInfos={basicInfos} />
    ) : basicInfos.type === ENTITIES_TYPE_ENUM.TEAM ? (
      <Team basicInfos={basicInfos} />
    ) : (
      <EntityNotFound />
    )
  ) : (
    <EntityNotFound />
  );
}
