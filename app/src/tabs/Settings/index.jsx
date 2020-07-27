import React from 'react';
import Stripe from './Stripe';
import ManageRoles from './ManageRoles';
import Memberships from './Memberships';
import AddMembership from './AddMembership';
import AddOptionsEvent from './AddOptionsEvent';
import TeamRegistered from './TeamRegistered';
import EventSettings from './EventSettings';
import BasicInfos from './BasicInfos';
import { useParams } from 'react-router-dom';
import {
  ENTITIES_ROLE_ENUM,
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums';
import { Card, IgContainer } from '../../components/Custom';
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
          <IgContainer>
            <Stripe id={id} />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
          </IgContainer>
        );
      }

      if (isEditor) {
        return (
          <IgContainer>
            <Stripe id={id} />
          </IgContainer>
        );
      }
      return <></>;

    case GLOBAL_ENUM.EVENT:
      if (isAdmin) {
        return (
          <IgContainer>
            <BasicInfos basicInfos={basicInfos} />
            <Description />
            <EventSettings />
            <AddOptionsEvent />
            <TeamRegistered />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
          </IgContainer>
        );
      }
      if (isEditor) {
        return (
          <IgContainer>
            <Description />
            <AddOptionsEvent />
            <TeamRegistered />
            <EventSettings />
          </IgContainer>
        );
      }
      return <></>;
    case GLOBAL_ENUM.ORGANIZATION:
      if (isAdmin) {
        return (
          <IgContainer>
            <Stripe id={id} />
            <AddMembership />
            <ManageRoles role={role} />
            <Card
              items={{ id, name: basicInfos.name }}
              type={CARD_TYPE_ENUM.DELETE_ENTITY}
            />
          </IgContainer>
        );
      }
      if (isEditor) {
        return (
          <IgContainer>
            <Stripe id={id} />
            <AddMembership />
          </IgContainer>
        );
      }
      return <Memberships basicInfos={basicInfos} />;

    case GLOBAL_ENUM.PERSON:
      if (isAdmin) {
        return (
          <IgContainer>
            <Stripe id={id} />
            <ManageRoles role={role} />
          </IgContainer>
        );
      }
      if (isEditor) {
        return (
          <IgContainer>
            <Stripe id={id} />
          </IgContainer>
        );
      }
      return <></>;
    default:
      throw 'type not defined';
  }
}
