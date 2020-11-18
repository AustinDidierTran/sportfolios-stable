import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Paper, Avatar, Select } from '../../../components/Custom';
import {
  List,
  ListItem,
  ListItemText,
} from '../../../components/MUI';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { getEntityTypeName } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM } from '../../../Store';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import styles from './ManageRoles.module.css';
import { goTo, ROUTES } from '../../../actions/goTo';
import AddAdmins from './AddAdmins';
import { getInitialsFromName } from '../../../utils/stringFormats';
import { GLOBAL_ENUM } from '../../../../../common/enums';

export default function ManageRoles() {
  const { t } = useTranslation();

  const { id: entity_id } = useParams();

  const [entities, setEntities] = useState([]);
  const [entity, setEntity] = useState([]);

  const getEntity = async () => {
    const res = await api(`/api/entity?id=${entity_id}`);
    setEntity(res.data.basicInfos);
  };

  useEffect(() => {
    getEntity();
  }, [entity_id]);

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

  const blackList = useMemo(
    () => entities.map(entity => entity.entity_id_admin),
    [entities],
  );

  const updateRole = async (entity_id_admin, role) => {
    if (entity.type === GLOBAL_ENUM.PERSON) {
      await api(`/api/entity/role`, {
        method: 'PUT',
        body: JSON.stringify({
          entity_id,
          entity_id_admin,
          role,
        }),
      });
      return;
    }
    const arr = entities.filter(
      e => e.role === ENTITIES_ROLE_ENUM.ADMIN,
    );

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

  const handleChange = async (newRole, entity_id_admin) => {
    await updateRole(entity_id_admin, newRole);
    await updateEntities();
  };

  const items = [
    { display: t('admin'), value: ENTITIES_ROLE_ENUM.ADMIN },
    { display: t('editor'), value: ENTITIES_ROLE_ENUM.EDITOR },
    { display: t('remove'), value: ENTITIES_ROLE_ENUM.VIEWER },
  ];

  return (
    <Paper title={t('admins')}>
      {entities.map((e, index) => [
        <List disablePadding className={styles.list} key={index}>
          <ListItem
            key={index}
            button
            onClick={() =>
              goTo(ROUTES.entity, { id: e.entity_id_admin })
            }
            className={styles.item}
          >
            <ListItemIcon>
              <Avatar
                photoUrl={e.photoUrl}
                initials={getInitialsFromName(
                  e.surname ? `${e.name} ${e.surname}` : e.name,
                )}
              />
            </ListItemIcon>
            {e.surname ? (
              <ListItemText
                primary={`${e.name} ${e.surname}`}
                secondary={t(getEntityTypeName(e.type))}
              ></ListItemText>
            ) : (
              <ListItemText
                primary={`${e.name}`}
                secondary={t(getEntityTypeName(e.type))}
              ></ListItemText>
            )}
          </ListItem>
          <Select
            key={`s${index}`}
            value={e.role}
            labelId="Role"
            onChange={newRole =>
              handleChange(newRole, e.entity_id_admin)
            }
            className={styles.select}
            options={items}
          />
        </List>,
      ])}
      <hr />
      <AddAdmins onClick={onClick} blackList={blackList} />
    </Paper>
  );
}
