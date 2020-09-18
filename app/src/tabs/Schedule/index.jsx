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
import SubmitScore from './SubmitScore';
import { useEffect } from 'react';
import api from '../../actions/api';
import { useParams } from 'react-router-dom';

export default function ScheduleTab(props) {
  const { t } = useTranslation();
  const {
    basicInfos: { role },
  } = props;
  const { id: eventId } = useParams();

  const [game, setGame] = useState(false);
  const [phase, setPhase] = useState(false);
  const [time, setTime] = useState(false);
  const [team, setTeam] = useState(false);
  const [field, setField] = useState(false);

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

  useEffect(() => {
    addRegisteredTeams();
  }, []);

  const addRegisteredTeams = async () => {
    await api('/api/entity/addRegisteredToSchedule', {
      method: 'POST',
      body: JSON.stringify({
        eventId,
      }),
    });
  };

  if (role != ENTITIES_ROLE_ENUM.ADMIN) {
    return (
      <>
        <SubmitScore />
        <Games />
      </>
    );
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
      <AddPhase isOpen={phase} onClose={closePhase} />
      <AddGame isOpen={game} onClose={closeGame} />
      <SubmitScore />
      <Games role={role} />
    </>
  );
}
