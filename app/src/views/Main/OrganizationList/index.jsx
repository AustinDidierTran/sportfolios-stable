import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './OrganizationList.module.css';
import {
  Avatar,
  Paper,
  List,
  Button,
} from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import api from '../../../actions/api';

import history from '../../../stores/history';

import { ENTITIES_TYPE_ENUM } from '../../../../../common/enums';

export default function OrganizationList() {
  const { t } = useTranslation();

  const [organizations, setOrganizations] = useState([]);

  const getOrganizations = async () => {
    const { data } = await api(`/api/organizations`);

    setOrganizations(data);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  const handleClick = () => {
    history.push(ROUTES.createOrganization);
  };

  return (
    <Paper
      childrenProps={{ className: styles.card }}
      title={t('organizations')}
    >
      <Button onClick={handleClick} className={styles.button}>
        {t('create_organization')}
      </Button>
      <List
        items={organizations.map(org => ({
          value: org.name,
          onClick: () => goTo(ROUTES.entity, { id: org.id }),
          iconComponent: <Avatar photoUrl={org.photo_url} />,
          type: ENTITIES_TYPE_ENUM.ORGANIZATION,
        }))}
      />
    </Paper>
  );
}
