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

  const [role, setRole] = useState(null);

  console.log({ entities });

  return (
    <Paper className={styles.card} title={t('admins')}>
      <List disablePadding>
        {entities.map(entity => (
          <ListItem
            button
            onClick={() =>
              goTo(ROUTES.entity, { id: entity.entity_id_admin })
            }
          >
            <ListItemIcon>
              <Avatar photoUrl={entity.photo_url} />
            </ListItemIcon>
            <Typography className={styles.textField}>
              {entity.name}
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
            >
              <MenuItem value={ENTITIES_ROLE_ENUM.ADMIN}>
                Admin
              </MenuItem>
              <MenuItem value={ENTITIES_ROLE_ENUM.EDITOR}>
                Editor
              </MenuItem>
              <MenuItem value={null}>None</MenuItem>
            </Select>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
