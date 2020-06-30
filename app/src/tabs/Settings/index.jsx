import React from 'react';
import Stripe from './Stripe';
import ManageRoles from './ManageRoles';
import Memberships from './Memberships';
import AddMembership from './AddMembership';
import AddOptionsEvent from './AddOptionsEvent';
import { useParams } from 'react-router-dom';
import {
  ENTITIES_ROLE_ENUM,
  CARD_TYPE_ENUM,
} from '../../../../common/enums';
import styles from './Settings.module.css';
import { Card } from '../../components/Custom';
import { useAdmin, useEditor } from '../../hooks/roles';

export default function EntitySettings(props) {
  const { id } = useParams();

  const { basicInfos } = props;

  const { role = ENTITIES_ROLE_ENUM.VIEWER } = basicInfos;

  const isEditor = useEditor(role);

  const isAdmin = useAdmin(role);

  return (
    <div className={styles.main}>
      {isEditor ? (
        <>
          <Stripe id={id} />
          <AddMembership />
          <AddOptionsEvent />
          {isAdmin ? (
            <>
              <ManageRoles role={role} />
              <Card
                items={{ id, name: basicInfos.name }}
                type={CARD_TYPE_ENUM.DELETE_ENTITY}
              />
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Memberships basicInfos={basicInfos} />
      )}
    </div>
  );
}
