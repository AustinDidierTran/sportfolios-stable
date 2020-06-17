import React, { useEffect, useState, useContext } from 'react';

import { Paper, List } from '../../../../components/Custom';

import { MEMBERSHIP_TYPE_ENUM } from '../../../../Store';
import { LIST_ROW_TYPE_ENUM } from '../../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { Store } from '../../../../Store';

export default function Memberships(props) {
  const { t } = useTranslation();

  const {
    state: { userInfo },
  } = useContext(Store);

  const { basicInfos } = props;
  const { id } = basicInfos;

  const [persons, setPersons] = useState([]);

  useEffect(() => {
    setPersons(userInfo.persons);
  }, [userInfo]);

  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    getMemberships();
  }, []);

  const getMemberships = async () => {
    const res = await api(`/api/entity/memberships/?id=${id}`);
    setMemberships(res.data);
  };

  const member = async (person_id, type, organization_id) => {
    return await api(`/api/entity/member`, {
      method: 'GET',
      body: JSON.stringify({
        person_id,
        type,
        organization_id,
      }),
    });
  };

  const isMember = async (
    person_id,
    member_type,
    organization_id,
  ) => {
    const res = await member(person_id, member_type, organization_id);
    return !res; //TO BE VERIFIED
  };

  const getExpirationDate = async (
    person_id,
    type,
    organization_id,
  ) => {
    const res = await member(person_id, type, organization_id);
    return res.expirationDate;
  };

  const getName = type => {
    if (type === MEMBERSHIP_TYPE_ENUM.RECREATIONAL) {
      return t('recreational_member');
    } else if (type === MEMBERSHIP_TYPE_ENUM.COMPETITIVE) {
      return t('competitive_member');
    } else {
      return t('elite_member');
    }
  };

  const items = persons.map(person =>
    memberships.map(membership => [
      {
        type: LIST_ROW_TYPE_ENUM.MEMBERSHIP,
        isMember: isMember(person.entity_id, membership.type, id),
        name: getName(membership.type),
        membership_type: membership.type,
        expirationDate: getExpirationDate(
          person.entity_id,
          membership.type,
          id,
        ),
        person_id: person.entity_id,
        entity_id: id,
      },
    ]),
  );

  return (
    <>
      {persons.map(person => (
        <Paper title={`${person.name} ${person.surname}`}>
          <List items={items}></List>
        </Paper>
      ))}
    </>
  );
}
