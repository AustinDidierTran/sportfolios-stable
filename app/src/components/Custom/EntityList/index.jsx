import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './EntityList.module.css';
import { Paper, List, Button } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import api from '../../../actions/api';

import {
  ENTITIES_TYPE_ENUM,
  LIST_ROW_TYPE_ENUM,
} from '../../../../../common/enums';
import { useMemo } from 'react';

export default function EntityList(props) {
  const { t } = useTranslation();

  const { type } = props;

  const [entities, setEntities] = useState([]);

  const getEntities = async () => {
    const route = type
      ? `/api/entity/all?type=${type}`
      : '/api/entity/all';

    const { data } = await api(route);

    setEntities(data);
  };

  useEffect(() => {
    getEntities();
  }, [type]);

  const entityObject = useMemo(() => {
    if (type === ENTITIES_TYPE_ENUM.ORGANIZATION) {
      return {
        route: ROUTES.createOrganization,
        title: t('organizations'),
        buttonLabel: t('create_organization'),
        type: LIST_ROW_TYPE_ENUM.ORGANIZATION,
      };
    }
    if (type === ENTITIES_TYPE_ENUM.TEAM) {
      return {
        route: ROUTES.createTeam,
        title: t('teams'),
        buttonLabel: t('create_team'),
        type: LIST_ROW_TYPE_ENUM.TEAM,
      };
    }
    if (type === ENTITIES_TYPE_ENUM.PERSON) {
      return {
        route: ROUTES.createPerson,
        title: t('people'),
        buttonLabel: t('create_person'),
        type: LIST_ROW_TYPE_ENUM.PERSON,
      };
    }
  }, [type]);

  const handleClick = () => {
    goTo(entityObject.route);
  };

  return (
    <Paper
      childrenProps={{ className: styles.card }}
      title={entityObject.title}
    >
      <Button
        onClick={handleClick}
        style={{ marginBottom: 16 }}
        className={styles.button}
      >
        {entityObject.buttonLabel}
      </Button>
      <List
        items={entities.map(entity => ({
          id: entity.id,
          name: entity.name,
          photoUrl: entity.photoUrl,
          type: Number(entity.type),
        }))}
      />
    </Paper>
  );
}
