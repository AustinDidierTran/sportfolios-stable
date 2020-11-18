import React, { useState, useEffect } from 'react';
import styles from './Memberships.module.css';
import { useTranslation } from 'react-i18next';

import { Paper, Button, List } from '../../components/Custom';
import api from '../../actions/api';
import { useQuery } from '../../hooks/queries';
import { LIST_ITEM_ENUM } from '../../../../common/enums';
import { getMemberships } from '../../utils/memberships';

export default function Memberships() {
  const { t } = useTranslation();

  const {
    entity_id: entityId,
    person_id: personId,
    membership_type: memberTypeProps,
    isMember,
  } = useQuery();

  const membershipType = Number(memberTypeProps);

  const [options, setOptions] = useState([]);
  const [entity, setEntity] = useState([]);
  const [person, setPerson] = useState([]);

  useEffect(() => {
    getPerson();
  }, []);

  const getPerson = async () => {
    const {
      data: { basicInfos: data },
    } = await api(`/api/entity/?id=${personId}`);
    setPerson(data);
  };

  useEffect(() => {
    getEntity();
  }, []);

  const getEntity = async () => {
    const {
      data: { basicInfos: data },
    } = await api(`/api/entity/?id=${entityId}`);
    setEntity(data);
  };

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    const memberships = await getMemberships();
    const options = memberships
      .filter(d => d.membershipType === membershipType)
      .map(d => ({
        ...d,
        isMember,
        personId,
        type: LIST_ITEM_ENUM.MEMBERSHIP_DETAIL,
      }));
    setOptions(options);
  };

  const onCancel = () => {
    history.back();
  };

  return (
    <>
      <Paper title={t('member')} />
      <List items={[person]} />
      <Paper title={t('organization')} />
      <List items={[entity]} />
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
