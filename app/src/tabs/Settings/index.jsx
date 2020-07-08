import React from 'react';
import Stripe from './Stripe';
import ManageRoles from './ManageRoles';
import Memberships from './Memberships';
import AddMembership from './AddMembership';
import AddOptionsEvent from './AddOptionsEvent';
import TeamRegistered from './TeamRegistered';
import EventSettings from './EventSettings';
import { useParams } from 'react-router-dom';
import {
  ENTITIES_ROLE_ENUM,
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums';
import styles from './Settings.module.css';
import { Card } from '../../components/Custom';
import { useAdmin, useEditor } from '../../hooks/roles';
import Description from './Description';

export default function EntitySettings(props) {
  const { id } = useParams();

  const { basicInfos } = props;

  const { role = ENTITIES_ROLE_ENUM.VIEWER, type } = basicInfos;

  const isEditor = useEditor(role);

  const isAdmin = useAdmin(role);

  switch (type) {
    case GLOBAL_ENUM.TEAM:
      if (isAdmin) {
        return (
          <div className={styles.main}>
            <Stripe id={id} />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
          </div>
        );
      }

      if (isEditor) {
        return (
          <div className={styles.main}>
            <Stripe id={id} />
          </div>
        );
      }
      return <></>;

    case GLOBAL_ENUM.EVENT:
      if (isAdmin) {
        return (
          <div className={styles.main}>
            <Description />
            <AddOptionsEvent />
            <TeamRegistered />
            <EventSettings />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.main}>
            <Description />
            <AddOptionsEvent />
            <TeamRegistered />
            <EventSettings />
          </div>
        );
      }
      return <></>;
    case GLOBAL_ENUM.ORGANIZATION:
      if (isAdmin) {
        return (
          <div className={styles.main}>
            <Stripe id={id} />
            <AddMembership />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.main}>
            <Stripe id={id} />
            <AddMembership />
          </div>
        );
      }
      return <Memberships basicInfos={basicInfos} />;

    case GLOBAL_ENUM.PERSON:
      if (isAdmin) {
        return (
          <div className={styles.main}>
            <Stripe id={id} />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.main}>
            <Stripe id={id} />
          </div>
        );
      }
      return <></>;
    default:
      throw 'type not defined';
  }
}
