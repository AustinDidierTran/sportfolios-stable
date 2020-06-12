import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Paper, Avatar } from '../../../../components/Custom';
import {
  Typography,
  List,
  ListItem,
} from '../../../../components/MUI';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
          >
            <MenuItem value={ENTITIES_ROLE_ENUM.ADMIN}>
              Admin
            </MenuItem>
            <MenuItem value={ENTITIES_ROLE_ENUM.EDITOR}>
              {t('editor')}
            </MenuItem>
            <MenuItem value={ENTITIES_ROLE_ENUM.VIEWER}>
              {t('viewer')}
            </MenuItem>
          </Select>,
        ])}
      </List>
    </Paper>
  );
}
