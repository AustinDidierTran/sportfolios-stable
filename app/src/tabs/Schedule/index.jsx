import React, { useState } from 'react';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import { Button } from '../../components/Custom';
import styles from './Schedule.module.css';
import { useTranslation } from 'react-i18next';
import AddGame from './AddGame';
import AddPhase from './AddPhase';

export default function ScheduleTab(props) {
  const { t } = useTranslation();
  const {
    basicInfos: { role },
  } = props;

  const [game, setGame] = useState(false);
  const [phase, setPhase] = useState(false);
  const [phaseId, setPhaseId] = useState(null);

  const openGame = () => {
    setGame(true);
  };

  const closeGame = () => {
    setGame(false);
  };
  const openPhase = () => {
    setPhase(true);
  };

  const closePhase = () => {
    setPhase(false);
  };

  const openGameDialog = phaseId => {
    setPhaseId(phaseId);
    setGame(true);
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
          onClick={openGame}
          className={styles.button}
        >
          {t('add_game')}
        </Button>
        <AddPhase
          isOpen={phase}
          onClose={closePhase}
          openGameDialog={openGameDialog}
        />
        <AddGame
          isOpen={game}
          onClose={closeGame}
          phaseId={phaseId}
        />
      </>
    );
  }
  return <h1>SCHEDULE</h1>;
}
