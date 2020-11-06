import React from 'react';

import loadable from '@loadable/component';
import { useParams } from 'react-router-dom';
import {
  ENTITIES_ROLE_ENUM,
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums';
import { Card } from '../../components/Custom';
import { useAdmin, useEditor } from '../../hooks/roles';
import styles from './Settings.module.css';
import BottomPageLogo from '../../components/Custom/BottomPageLogo';

const Stripe = loadable(() => import('./Stripe'));
const ManageRoles = loadable(() => import('./ManageRoles'));
const AddMembership = loadable(() => import('./AddMembership'));
const AddOptionsEvent = loadable(() => import('./AddOptionsEvent'));
const TeamRegistered = loadable(() => import('./TeamRegistered'));
const EventSettings = loadable(() => import('./EventSettings'));
const BasicInfos = loadable(() => import('./BasicInfos'));
const Description = loadable(() => import('./Description'));
const QuickDescription = loadable(() => import('./QuickDescription'));
const ChangeAlias = loadable(() => import('./ChangeAlias'));

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
          <div className={styles.div}>
            <Stripe id={id} />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
            <BottomPageLogo />
          </div>
        );
      }

      if (isEditor) {
        return (
          <div className={styles.div}>
            <Stripe id={id} />
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;

    case GLOBAL_ENUM.EVENT:
      if (isAdmin) {
        return (
          <div className={styles.div}>
            <BasicInfos basicInfos={basicInfos} />
            <ChangeAlias />
            <QuickDescription />
            <Description />
            <EventSettings />
            <AddOptionsEvent />
            <TeamRegistered />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
            <BottomPageLogo />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.div}>
            <Description />
            <AddOptionsEvent />
            <TeamRegistered />
            <EventSettings />
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;
    case GLOBAL_ENUM.ORGANIZATION:
      if (isAdmin) {
        return (
          <div className={styles.div}>
            <BasicInfos basicInfos={basicInfos} />
            <AddMembership />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
            <BottomPageLogo />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.div}>
            <Stripe id={id} />
            <AddMembership />
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;

    case GLOBAL_ENUM.PERSON:
      if (isAdmin) {
        return (
          <div className={styles.div}>
            <Stripe id={id} />
            <ManageRoles role={role} />
            <BottomPageLogo />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.div}>
            <Stripe id={id} />
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;
    default:
      throw 'type not defined';
  }
}
