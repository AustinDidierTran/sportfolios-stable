import React, { useState } from 'react';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import { Button } from '../../components/Custom';
import styles from './Schedule.module.css';
import { useTranslation } from 'react-i18next';
import AddGame from './AddGame';

export default function ScheduleTab(props) {
  const { t } = useTranslation();
  const {
    basicInfos: { role },
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const openPhase = () => {
    setPhase(true);
  };

  if (role === ENTITIES_ROLE_ENUM.ADMIN) {
    return (
      <>
        <Button
          size="small"
          variant="contained"
          endIcon="Add"
          style={{ margin: '8px' }}
          onClick={openPhase}
          className={styles.button}
        >
          {t('add_phase')}
        </Button>
        <Button
          size="small"
          variant="contained"
          endIcon="Add"
          style={{ margin: '8px' }}
          onClick={openDialog}
          className={styles.button}
        >
          {t('add_game')}
        </Button>
        <AddGame isOpen={isOpen} />
      </>
    );
  }
  return <h1>SCHEDULE</h1>;
}
