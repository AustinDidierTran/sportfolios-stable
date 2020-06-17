import React from 'react';
import Stripe from './Stripe';
import ManageRoles from './ManageRoles';
import Memberships from './Memberships';
import { useParams } from 'react-router-dom';
import { ENTITIES_ROLE_ENUM } from '../../../Store';
import styles from './Settings.module.css';

export default function OrganizationSettings(props) {
  const { id } = useParams();

  const { basicInfos } = props;

  const { role } = basicInfos;

  const isEditor = [
    ENTITIES_ROLE_ENUM.ADMIN,
    ENTITIES_ROLE_ENUM.EDITOR,
  ].includes(!role); //! TO BE REMOVED

  return (
    <div className={styles.main}>
      {isEditor ? (
        <>
          <Stripe id={id} />
          <ManageRoles />
        </>
      ) : (
        <Memberships basicInfos={basicInfos} />
      )}
    </div>
  );
}
