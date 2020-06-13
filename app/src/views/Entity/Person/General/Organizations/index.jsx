import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import {
  Avatar,
  List,
  Paper,
} from '../../../../../components/Custom';
import api from '../../../../../actions/api';
import { goTo, ROUTES } from '../../../../../actions/goTo';

export default function Organizations() {
  const { t } = useTranslation();

  const [organizations, setOrganizations] = useState([]);
  const getOrganizations = async () => {
    const { data } = await api(`/api/organizations`);

    setOrganizations(data);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <Paper className={styles.card} title={t('organizations')}>
      <List
        items={organizations.map(organization => ({
          value: organization.name,
          onClick: () => goTo(ROUTES.entity, { id: organization.id }),
          iconComponent: <Avatar photoUrl={organization.photoUrl} />,
        }))}
      />
    </Paper>
  );
}
