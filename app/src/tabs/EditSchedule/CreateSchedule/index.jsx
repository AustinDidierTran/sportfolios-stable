import React, { useContext, useState } from 'react';
import { Button } from '../../../components/Custom';
import styles from '../EditSchedule.module.css';
import { useTranslation } from 'react-i18next';
import AddGame from './AddGame';
import AddPhase from './AddPhase';
import AddTimeSlot from './AddTimeSlot';
import AddTeam from './AddTeam';
import AddField from './AddField';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import { Store, SCREENSIZE_ENUM } from '../../../Store';

export default function ScheduleTab(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    state: { screenSize },
  } = useContext(Store);
  const { update } = props;

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
        disabled // will be changed
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
      {screenSize === SCREENSIZE_ENUM.sm ||
      screenSize === SCREENSIZE_ENUM.xs ? (
        <></>
      ) : (
        <Button
          size="small"
          variant="contained"
          endIcon="BuildIcon"
          style={{ margin: '8px' }}
          onClick={() => goTo(ROUTES.scheduleInteractiveTool, { id })}
          className={styles.button}
        >
          {t('interactive_tool')}
        </Button>
      )}
      <AddTimeSlot isOpen={time} onClose={closeTime} />
      <AddField isOpen={field} onClose={closeField} />
      <AddTeam isOpen={team} onClose={closeTeam} />
      <AddPhase isOpen={phase} onClose={closePhase} />
      <AddGame isOpen={game} onClose={closeGame} update={update} />
    </>
  );
}
