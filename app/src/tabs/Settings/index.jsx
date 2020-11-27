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

const AddMembership = loadable(() => import('./AddMembership'));
const AddOptionsEvent = loadable(() => import('./AddOptionsEvent'));
const BankAccount = loadable(() => import('./BankAccount'));
const BasicInfos = loadable(() => import('./BasicInfos'));
const ChangeAlias = loadable(() => import('./ChangeAlias'));
const Description = loadable(() => import('./Description'));
const EventSettings = loadable(() => import('./EventSettings'));
const ManageRoles = loadable(() => import('./ManageRoles'));
const QuickDescription = loadable(() => import('./QuickDescription'));
const Reports = loadable(() => import('./Reports'));
const TeamRegistered = loadable(() => import('./TeamRegistered'));

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
            <BankAccount />
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
            <TeamRegistered />
            <AddOptionsEvent />
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
            <BasicInfos basicInfos={basicInfos} />
            <ChangeAlias />
            <QuickDescription />
            <Description />
            <EventSettings />
            <AddOptionsEvent />
            <TeamRegistered />
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
            <BankAccount />
            <Reports />
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
            <BasicInfos basicInfos={basicInfos} />
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
            <BankAccount />
            <ManageRoles role={role} />
            <BottomPageLogo />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.div}>
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;
    default:
      throw 'type not defined';
  }
}
