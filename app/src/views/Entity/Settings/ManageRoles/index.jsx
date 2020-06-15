import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Paper, Avatar, Select } from '../../../../components/Custom';
import {
  Typography,
  List,
  ListItem,
} from '../../../../components/MUI';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { ENTITIES_ROLE_ENUM } from '../../../../Store';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import styles from './ManageRoles.module.css';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function ManageRoles() {
  const { t } = useTranslation();

  const { id } = useParams();

  const [entities, setEntities] = useState([]);

  const updateEntities = async () => {
    const res = await api(`/api/entity/roles?id=${id}`);
    setEntities(res.data);
  };

  useEffect(() => {
    updateEntities();
  }, []);

  const updateRole = async (entity_id_admin, role) => {
    await api(`/api/entity/role`, {
      method: 'PUT',
      body: JSON.stringify({
        entity_id: id,
        entity_id_admin,
        role,
      }),
    });
  };

  const handleChange = async (event, entity_id_admin) => {
    await updateRole(entity_id_admin, event.target.value);
    await updateEntities();
  };

  const items = [
    { display: t('Admin'), value: ENTITIES_ROLE_ENUM.ADMIN },
    { display: t('editor'), value: ENTITIES_ROLE_ENUM.EDITOR },
    { display: t('viewer'), value: ENTITIES_ROLE_ENUM.VIEWER },
  ];

  return (
    <Paper title={t('admins')}>
      <List disablePadding className={styles.list}>
        {entities.map((entity, index) => [
          <ListItem
            key={`l${index}`}
            button
            onClick={() =>
              goTo(ROUTES.entity, { id: entity.entity_id_admin })
            }
            className={styles.item}
          >
            <ListItemIcon>
              <Avatar photoUrl={entity.photo_url} />
            </ListItemIcon>
            <Typography className={styles.textField}>
              {entity.name}
            </Typography>
          </ListItem>,
          <Select
            key={`s${index}`}
            value={entity.role}
            labelId="Role"
            onChange={e => handleChange(e, entity.entity_id_admin)}
            className={styles.select}
            options={items}
          />,
        ])}
      </List>
    </Paper>
  );
}
