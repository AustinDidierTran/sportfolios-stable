import React from 'react';
import Stripe from './Stripe';
import ManageRoles from './ManageRoles';
import Memberships from './Memberships';
import AddMembership from './AddMembership';
import { useParams } from 'react-router-dom';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import styles from './Settings.module.css';
import { DeleteEntityCard } from '../../components/Cards';
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
          {isAdmin ? (
            <>
              <ManageRoles role={role} />
              <AddMembership />
              <DeleteEntityCard
                id={id}
                type={basicInfos.type}
                name={basicInfos.name}
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
