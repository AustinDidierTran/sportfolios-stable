import React, { useState, useEffect } from 'react';
import styles from './Memberships.module.css';
import { useTranslation } from 'react-i18next';
import { MEMBERSHIP_TYPE_ENUM } from '../../Store';

import { Paper, Select, Button } from '../../components/Custom';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { useParams } from 'react-router-dom';

export default function Memberships() {
  const { t } = useTranslation();

  const { id } = useParams();

  const items = [
    {
      value: MEMBERSHIP_TYPE_ENUM.RECREATIONAL,
      display: t('recreational_member'),
    },
    {
      value: MEMBERSHIP_TYPE_ENUM.COMPETITIVE,
      display: t('competitive_member'),
    },
    { value: MEMBERSHIP_TYPE_ENUM.ELITE, display: t('elite_member') },
  ];

  const [membership, setMembership] = useState();

  const [person, setPerson] = useState();

  const [persons, setPersons] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setPersons(
      userInfo.persons.map(person => ({
        ...person,
        display: `${person.name} ${person.surname}`,
        value: person.entity_id,
      })),
    );
  }, []);

  const personChange = event => {
    setPerson(event.target.value);
  };
  const membershipChange = event => {
    setMembership(event.target.value);
  };

  const onClick = async () => {
    if (!person) {
    }
    if (!membership) {
    }
    await addMembership(membership, person, id);
  };

  const addMembership = async (type, person_id, organization_id) => {
    await api('/api/entity/member', {
      method: 'POST',
      body: JSON.stringify({
        member_type: type,
        person_id,
        organization_id,
      }),
    });
    goTo(ROUTES.entity, { id });
  };

  const onCancel = () => {
    history.back();
  };

  return (
    <Paper title={t('memberships')}>
      <Select
        className={styles.select}
        label={t('persons')}
        onChange={personChange}
        options={persons}
      />
      <Select
        className={styles.select}
        label={t('memberships')}
        onChange={membershipChange}
        options={items}
      />
      <div className={styles.buttons}>
        <Button className={styles.becomeMember} onClick={onClick}>
          {t('become_member')}
        </Button>
        <Button
          className={styles.cancel}
          endIcon="Close"
          onClick={onCancel}
          style={{ marginLeft: '8px' }}
          color="secondary"
        >
          {t('cancel')}
        </Button>
      </div>
    </Paper>
  );
}
