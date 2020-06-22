import React, { useState, useEffect } from 'react';
import styles from './Memberships.module.css';
import { useTranslation } from 'react-i18next';

import { Paper, Button, List } from '../../components/Custom';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { useQuery } from '../../hooks/queries';
import { LIST_ROW_TYPE_ENUM } from '../../../../common/enums';
import { TABS_ENUM } from '../Entity/Organization';

export default function Memberships() {
  const { t } = useTranslation();

  const {
    entity_id,
    person_id,
    membership_type: memberTypeProps,
  } = useQuery();

  const membership_type = Number(memberTypeProps);

  const [options, setOptions] = useState([]);
  const [entity, setEntity] = useState([]);
  const [person, setPerson] = useState([]);

  useEffect(() => {
    getPerson();
  }, []);

  const getPerson = async () => {
    const res = await api(`/api/entity/?id=${person_id}`);
    const arr = [];
    arr.push(res.data);
    setPerson(arr);
  };

  useEffect(() => {
    getEntity();
  }, []);

  const getEntity = async () => {
    const res = await api(`/api/entity/?id=${entity_id}`);
    const arr = [];
    arr.push(res.data);
    setEntity(arr);
  };

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    const res = await api(`/api/entity/memberships/?id=${entity_id}`);
    const options = res.data.filter(r => {
      r.type = LIST_ROW_TYPE_ENUM.MEMBERSHIP_DETAIL;
      r.handleClick = handleClick;
      return membership_type === r.membership_type;
    });
    console.log('allo');
    setOptions(options);
  };

  const handleClick = async index => {
    console.log({ options });
    await addMembership(
      options[index].membership_type,
      options[index].person_id,
      options[index].entity_id,
    );
    goTo(
      ROUTES.entity,
      { id: entity_id },
      { tab: TABS_ENUM.SETTINGS },
    );
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
  };

  const onCancel = () => {
    history.back();
  };

  return (
    <>
      <Paper title={t('member')} />
      <List items={person} />
      <Paper title={t('organization')} />
      <List items={entity} />
      <Paper title={t('membership')} />
      <List items={options} />
      <div className={styles.buttons}>
        <Button
          className={styles.cancel}
          endIcon="Close"
          onClick={onCancel}
          color="secondary"
        >
          {t('cancel')}
        </Button>
      </div>
    </>
  );
}
