import React, { useContext } from 'react';
import { ACTION_ENUM, Store } from '../../../Store';
import { Button } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';

import styles from './Disconnect.module.css';

export default function Disconnect() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  return (
    <Button
      className={styles.button}
      color="secondary"
      onClick={() => dispatch({ type: ACTION_ENUM.LOGOUT })}
    >
      {t('logout')}
    </Button>
  );
}
