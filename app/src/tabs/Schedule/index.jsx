import React, { useState } from 'react';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import { Button } from '../../components/Custom';
import styles from './Schedule.module.css';
import { useTranslation } from 'react-i18next';
import AddGame from './AddGame';
import AddPhase from './AddPhase';
import AddTimeSlot from './AddTimeSlot';
import AddTeam from './AddTeam';
import AddField from './AddField';
import Games from './Games';

export default function ScheduleTab(props) {
  const { t } = useTranslation();
  const {
    basicInfos: { role },
  } = props;

  const [game, setGame] = useState(false);
  const [phase, setPhase] = useState(false);
  const [time, setTime] = useState(false);
  const [team, setTeam] = useState(false);
  const [field, setField] = useState(false);
  const [phaseId, setPhaseId] = useState('');

  const openGame = () => {
    setGame(true);
  };

  const closeGame = () => {
    setGame(false);
  };

  const openGameDialog = phaseId => {
    setPhaseId(phaseId);
    setGame(true);
  };

  const openPhase = () => {
    setPhase(true);
  };

  const closePhase = () => {
    setPhase(false);
  };

  const keepPhase = phaseId => {
    setPhaseId(phaseId);
  };

  const openTime = () => {
    setTime(true);
  };
  const closeTime = () => {
    setTime(false);
  };
  const openTeam = () => {
    setTeam(true);
  };
  const closeTeam = () => {
    setTeam(false);
  };
  const openField = () => {
    setField(true);
  };
  const closeField = () => {
    setField(false);
  };
  if (role != ENTITIES_ROLE_ENUM.ADMIN) {
    return <Games />;
  }
  return (
    <>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={openTime}
        className={styles.button}
      >
        {t('add_time_slot')}
      </Button>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={openField}
        className={styles.button}
      >
        {t('add_field')}
      </Button>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={openTeam}
        className={styles.button}
      >
        {t('add_team')}
      </Button>
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
      <AddTimeSlot isOpen={time} onClose={closeTime} />
      <AddField isOpen={field} onClose={closeField} />
      <AddTeam isOpen={team} onClose={closeTeam} />
      <AddPhase
        isOpen={phase}
        onClose={closePhase}
        openGameDialog={openGameDialog}
      />
      <AddGame
        isOpen={game}
        onClose={closeGame}
        phaseId={phaseId}
        keepPhase={keepPhase}
      />
      <Games role={role} />
    </>
  );
}
