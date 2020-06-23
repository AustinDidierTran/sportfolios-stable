import React from 'react';
import { Button, Paper } from '../../components/Custom';
import { useTranslation } from 'react-i18next';

import styles from './Events.module.css';
import { goTo, ROUTES } from '../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../common/enums';

export default function Events(props) {
  const { t } = useTranslation();
  const { basicInfos } = props;

  const handleClick = () => {
    goTo(ROUTES.create, null, {
      type: GLOBAL_ENUM.EVENT,
      id: basicInfos.id,
    });
  };

  return (
    <Paper title={t('events')}>
      <Button
        onClick={handleClick}
        style={{ marginBottom: 16, marginTop: 16 }}
        className={styles.button}
      >
        {t('create_event')}
      </Button>
    </Paper>
  );
}
