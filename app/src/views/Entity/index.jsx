import React, { useState, useEffect } from 'react';

import Organization from './Organization';
import Person from './Person';
import api from '../../actions/api';
import { Redirect, useParams } from 'react-router-dom';
import { goTo, ROUTES } from '../../actions/goTo';
import Team from './Team';

export const ENTITIES_TYPE_ENUM = {
  PERSON: 1,
  ORGANIZATION: 2,
  TEAM: 3,
};
export default function Entity() {
  const { id } = useParams();
  const [basicInfos, setBasicInfos] = useState(null);

  const updateBasicInfos = async () => {
    const { data } = await api(`/api/entity?id=${id}`);

    if (!data) {
      goTo(ROUTES.entityNotFound);
    }

    setBasicInfos(data);
  };

  useEffect(() => {
    updateBasicInfos();
  }, []);

  return basicInfos ? (
    basicInfos.type === ENTITIES_TYPE_ENUM.PERSON ? (
      <Person basicInfos={basicInfos} />
    ) : basicInfos.type === ENTITIES_TYPE_ENUM.ORGANIZATION ? (
      <Organization basicInfos={basicInfos} />
    ) : basicInfos.type === ENTITIES_TYPE_ENUM.TEAM ? (
      <Team basicInfos={basicInfos} />
    ) : (
      <Redirect to={ROUTES.entityNotFound} />
    )
  ) : (
    <></>
  );
}
