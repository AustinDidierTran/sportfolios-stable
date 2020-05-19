import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
} from '../../../components/MUI';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import styles from './Schedule.module.css';
import TeamSchedule from './TeamSchedule';
import Infos from './Infos';
import Ranking from './Ranking';
import { useTranslation } from 'react-i18next';

export default function Schedule(props) {
  const { t } = useTranslation();

  const [schedule, setSchedule] = useState(true);

  const [infos, setInfos] = useState(false);

  const [ranking, setRanking] = useState(false);

  const scheduleClick = () => {
    setInfos(false);
    setRanking(false);
    setSchedule(true);
  };
  const infosClick = () => {
    setSchedule(false);
    setRanking(false);
    setInfos(true);
  };
  const rankingClick = () => {
    setSchedule(false);
    setInfos(false);
    setRanking(true);
  };

  return (
    <Container className={styles.container}>
      <ButtonGroup className={styles.buttons}>
        {schedule ? (
          <Button
            onClick={scheduleClick}
            variant="contained"
            color="primary"
          >
            {t('schedule')}
          </Button>
        ) : (
          <Button onClick={scheduleClick} variant="contained">
            {t('schedule')}
          </Button>
        )}
        {infos ? (
          <Button
            onClick={infosClick}
            variant="contained"
            color="primary"
          >
            Infos
          </Button>
        ) : (
          <Button onClick={infosClick} variant="contained">
            Infos
          </Button>
        )}
        {ranking ? (
          <Button
            onClick={rankingClick}
            variant="contained"
            color="primary"
          >
            {t('ranking')}
          </Button>
        ) : (
          <Button onClick={rankingClick} variant="contained">
            {t('ranking')}
          </Button>
        )}
      </ButtonGroup>
      {schedule ? <TeamSchedule /> : <> </>}
      {infos ? <Infos /> : <> </>}
      {ranking ? <Ranking /> : <> </>}
    </Container>
  );
}
