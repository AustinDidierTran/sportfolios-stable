import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import {
  Avatar,
  List,
  Paper,
} from '../../../../../components/Custom';
import api from '../../../../../actions/api';
import { GLOBAL_ENUM } from '../../../../../../../common/enums';

export default function Organizations() {
  const { t } = useTranslation();

  const [organizations, setOrganizations] = useState([]);
  const getOrganizations = async () => {
    const { data } = await api(
      `/api/entity/all?type=${GLOBAL_ENUM.ORGANIZATION}`,
    );

    setOrganizations(data);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <Paper className={styles.card} title={t('organizations')}>
      <List
        items={organizations.map((organization, index) => ({
          id: organization.id,
          value: organization.name,
          iconComponent: (
            <Avatar photoUrl={organization.photoUrl} key={index} />
          ),
        }))}
      />
    </Paper>
  );
}
