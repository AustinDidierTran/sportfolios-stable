import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { List } from '../../../../components/Custom';
import {
  GLOBAL_ENUM,
  LIST_ITEM_ENUM,
  HEADER_FLYOUT_TYPE_ENUM,
} from '../../../../../../common/enums';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { ACTION_ENUM, Store } from '../../../../Store';

import styles from '../HeaderFlyout.module.css';

export default function Create() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const createTypesItems = [
    {
      type: LIST_ITEM_ENUM.CREATE_ENTITY,
      key: GLOBAL_ENUM.PERSON,
      icon: 'Person',
      title: t('person'),
      description: t('create_entity_person'),
      onClick: () => createPerson(),
    },
    {
      type: LIST_ITEM_ENUM.CREATE_ENTITY,
      key: GLOBAL_ENUM.TEAM,
      icon: 'Group',
      title: t('team'),
      description: t('create_entity_team'),
      onClick: () => createTeam(),
    },
    {
      type: LIST_ITEM_ENUM.CREATE_ENTITY,
      key: GLOBAL_ENUM.EVENT,
      icon: 'Event',
      title: t('event'),
      description: t('create_entity_event'),
      onClick: () => createEvent(),
    },
    {
      type: LIST_ITEM_ENUM.CREATE_ENTITY,
      key: GLOBAL_ENUM.ORGANIZATION,
      icon: 'Business',
      title: t('organization'),
      description: t('create_organization'),
      onClick: () => createOrganization(),
    },
  ];

  const handleCreateClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.CLOSED,
    });
  };

  const createPerson = () => {
    // TODO: hanlde creation better than this redirect (form?)
    goTo(ROUTES.create, {}, { type: GLOBAL_ENUM.PERSON });
    handleCreateClick();
  };
  const createTeam = () => {
    // TODO: hanlde creation better than this redirect (form?)
    goTo(ROUTES.create, {}, { type: GLOBAL_ENUM.TEAM });
    handleCreateClick();
  };
  const createEvent = () => {
    // TODO: hanlde creation better than this redirect (form?)
    goTo(ROUTES.create, {}, { type: GLOBAL_ENUM.EVENT });
    handleCreateClick();
  };
  const createOrganization = () => {
    // TODO: hanlde creation better than this redirect (form?)
    goTo(ROUTES.create, {}, { type: GLOBAL_ENUM.ORGANIZATION });
    handleCreateClick();
  };

  return (
    <div className={styles.createContainer}>
      <List items={createTypesItems} />
    </div>
  );
}
