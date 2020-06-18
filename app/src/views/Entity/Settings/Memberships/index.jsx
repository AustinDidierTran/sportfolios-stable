import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
} from 'react';

import moment from 'moment';
import { List, Paper } from '../../../../components/Custom';
import { MEMBERSHIP_TYPE_ENUM } from '../../../../Store';
import { LIST_ROW_TYPE_ENUM } from '../../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { Store } from '../../../../Store';
import { formatRoute } from '../../../../actions/goTo';

export default function Memberships(props) {
  const { t } = useTranslation();

  const {
    state: { userInfo },
  } = useContext(Store);

  const { basicInfos } = props;
  const { id } = basicInfos;

  const [persons, setPersons] = useState([]);

  useEffect(() => {
    getPersons();
  }, [userInfo]);

  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    getMemberships();
  }, [id]);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMembers();
  }, [persons]);

  const isMember = (person_id, type) => {
    const obj = members.filter(m => m.id === person_id);
    const finalObj = obj.find(o => o.memberType === type);
    return Boolean(finalObj);
  };

  const getPersons = async () => {
    setPersons(userInfo.persons);
  };

  const getMemberships = async () => {
    const res = await api(`/api/entity/memberships/?id=${id}`);
    setMemberships(res.data);
  };

  const getMembers = async () => {
    if (persons.length === 0) {
      return [];
    }
    const personsId = persons.map(person => person.entity_id);

    const res = await api(
      formatRoute('/api/entity/members', null, {
        personsId,
        id,
      }),
    );
    setMembers(res.data);
  };

  const getExpirationDate = (person_id, type) => {
    const obj = members.filter(m => m.id === person_id);
    const finalObj = obj.find(o => o.memberType === type);
    if (finalObj) {
      return moment(finalObj.expirationDate);
    } else {
      return null;
    }
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

  const allItems = useMemo(() => {
    if (!persons.length || !memberships.length || !members.length) {
      return [];
    }
    return persons.map(person =>
      memberships.map(membership => [
        {
          type: LIST_ROW_TYPE_ENUM.MEMBERSHIP,
          isMember: isMember(
            person.entity_id,
            membership.membership_type,
          ),
          name: getName(membership.membership_type),
          membership_type: membership.membership_type,
          expirationDate: getExpirationDate(
            person.entity_id,
            membership.membership_type,
          ),
          person_id: person.entity_id,
          entity_id: id,
          personName: `${person.name} ${person.surname}`,
        },
      ]),
    );
  }, [members, persons, memberships]);

  const personsItems = allItems.map(items =>
    items.map(it => (it = it[0])),
  );
  return (
    <Paper title={t('memberships')}>
      {personsItems.map(items => (
        <Paper title={items[0].personName}>
          <List items={items}></List>
        </Paper>
      ))}
    </Paper>
  );
}
