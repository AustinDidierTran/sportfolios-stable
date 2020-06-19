import React, { useMemo } from 'react';
import Stripe from './Stripe';
import ManageRoles from './ManageRoles';
import Memberships from './Memberships';
import { useParams } from 'react-router-dom';
import { ENTITIES_ROLE_ENUM } from '../../../../../common/enums';
import styles from './Settings.module.css';
import { DeleteEntityCard } from '../../../components/Cards';

export default function EntitySettings(props) {
  const { id } = useParams();

  const { basicInfos } = props;

  const { role = ENTITIES_ROLE_ENUM.VIEWER } = basicInfos;

  const isEditor = useMemo(
    () =>
      [ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(
        role,
      ),
    [role],
  );

  return (
    <div className={styles.main}>
      {isEditor ? (
        <>
          <Stripe id={id} />
          <ManageRoles />
          <DeleteEntityCard
            id={id}
            type={basicInfos.type}
            name={basicInfos.name}
          />
        </>
      ) : (
        <Memberships basicInfos={basicInfos} />
      )}
    </div>
  );
}
