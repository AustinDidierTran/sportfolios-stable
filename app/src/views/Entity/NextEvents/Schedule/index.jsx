import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Schedule.module.css';

import { Container, Button } from '../../../../components/MUI';
// import { TABS_ENUM } from '../../../Event';

export default function Schedule() {
  const { t } = useTranslation();

  // const handleClick = () => {
  //   goTo(ROUTES.mockEvent, { openTab: TABS_ENUM.SCHEDULE });
  // };

  return (
    <Container className={styles.container}>
      <Button
        variant="contained"
        // onClick={handleClick}
        color="primary"
        className={styles.button}
      >
        {t('schedule')}
      </Button>
    </Container>
  );
}
