import React, { useState, useEffect } from 'react';
import styles from './Memberships.module.css';
import { useTranslation } from 'react-i18next';
import { getMembershipName } from '../../utils/stringFormats';

import { Paper, Button, List } from '../../components/Custom';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { useQuery } from '../../hooks/queries';

export default function Memberships() {
  const { t } = useTranslation();

  const { entity_id, person_id, membership_type } = useQuery();

  const [options, setOptions] = useState([]);
  const [entity, setEntity] = useState([]);
  const [person, setPerson] = useState([]);
  // const [option, setOption] = useState([]);

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
    setOptions(res.data);
  };

  // const optionChange = event => {
  //   setOption(event.target.value);
  // };

  const onClick = async () => {
    await addMembership(membership_type, person_id, entity_id);
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

  console.log({ options });

  return (
    <>
      <Paper title={t('member')} />
      <List items={person} />
      <Paper title={t('organization')} />
      <List items={entity} />
      <Paper title={t(getMembershipName(membership_type))} />
      <h1>ALL OPTIONS</h1>
      {/* <List items={options} /> */}
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
    </>
  );
}
