import React from 'react';
import { useTranslation } from 'react-i18next';

import { goTo, ROUTES } from '../../../../actions/goTo';
import { Button } from '../../../../components/Custom';

import styles from './BecomeMember.module.css';

export default function BecomeMember(props) {
  const { t } = useTranslation();

  const { entity_id } = props;

  const handleClick = () => {
    goTo(ROUTES.memberships, { id: entity_id });
  };

  return (
    <Button
      onClick={handleClick}
      color="primary"
      variant="contained"
      className={styles.becomeMember}
    >
      {t('memberships')}
    </Button>
  );
}
