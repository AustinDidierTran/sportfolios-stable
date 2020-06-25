import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Paper, Avatar, Select } from '../../../components/Custom';
import { Typography, List, ListItem } from '../../../components/MUI';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { ENTITIES_ROLE_ENUM } from '../../../Store';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import styles from './ManageRoles.module.css';
import { goTo, ROUTES } from '../../../actions/goTo';
import AddAdmins from './AddAdmins';

export default function ManageRoles() {
  const { t } = useTranslation();

  const { id: entity_id } = useParams();

  const [entities, setEntities] = useState([]);

  const updateEntities = async () => {
    const res = await api(`/api/entity/roles?id=${entity_id}`);
    res.data.forEach((r, index) => {
      if (r.role === ENTITIES_ROLE_ENUM.VIEWER) {
        res.data.splice(index, 1);
      }
    });
    setEntities(res.data);
  };

  useEffect(() => {
    updateEntities();
  }, []);

  const updateRole = async (entity_id_admin, role) => {
    const arr = entities.filter(e => {
      return e.role === ENTITIES_ROLE_ENUM.ADMIN;
    });
    if (
      arr.length < 2 &&
      arr[0].entity_id_admin === entity_id_admin
    ) {
      throw 'Last Admin';
    } else {
      await api(`/api/entity/role`, {
        method: 'PUT',
        body: JSON.stringify({
          entity_id,
          entity_id_admin,
          role,
        }),
      });
    }
  };

  const onClick = async (e, { id }) => {
    await api(`/api/entity/role`, {
      method: 'POST',
      body: JSON.stringify({
        entity_id_admin: id,
        role: ENTITIES_ROLE_ENUM.EDITOR,
        entity_id,
      }),
    });
    await updateEntities();
  };

  const handleChange = async (event, entity_id_admin) => {
    await updateRole(entity_id_admin, event.target.value);
    await updateEntities();
  };

  const items = [
    { display: t('admin'), value: ENTITIES_ROLE_ENUM.ADMIN },
    { display: t('editor'), value: ENTITIES_ROLE_ENUM.EDITOR },
    { display: t('none'), value: ENTITIES_ROLE_ENUM.VIEWER },
  ];

  return (
    <Paper title={t('admins')}>
      {entities.map((entity, index) => [
        <List disablePadding className={styles.list}>
          <ListItem
            key={`l${index}`}
            button
            onClick={() =>
              goTo(ROUTES.entity, { id: entity.entity_id_admin })
            }
            className={styles.item}
          >
            <ListItemIcon>
              <Avatar photoUrl={entity.photoUrl} />
            </ListItemIcon>
            <Typography className={styles.textField}>
              {entity.name} {entity.surname}
            </Typography>
          </ListItem>
          <Select
            key={`s${index}`}
            value={entity.role}
            labelId="Role"
            onChange={e => handleChange(e, entity.entity_id_admin)}
            className={styles.select}
            options={items}
          />
        </List>,
      ])}
      <hr />
      <AddAdmins onClick={onClick} />
    </Paper>
  );
}
