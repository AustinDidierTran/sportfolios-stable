import React, { useState, useContext, useEffect } from 'react';

import Organization from './Organization';
import Person from './Person';
import api from '../../actions/api';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../hooks/queries';
import { goTo, ROUTES } from '../../actions/goTo';

export const ENTITIES_TYPE_ENUM = {
  PERSON: 1,
  ORGANIZATION: 2,
  TEAM: 3,
};
export default function Entity(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [basicInfos, setBasicInfos] = useState(null);
  const query = useQuery();

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

  const isManager = id === id; //Need query to identify users that are managers

  return basicInfos ? (
    basicInfos.type === ENTITIES_TYPE_ENUM.PERSON ? (
      <Person basicInfos={basicInfos} />
    ) : basicInfos.type === ENTITIES_TYPE_ENUM.ORGANIZATION ? (
      <Organization basicInfos={basicInfos} />
    ) : (
      <></>
    )
  ) : (
    <></>
  );
}
