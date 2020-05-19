import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
  Card,
} from '../../../components/MUI';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import styles from './Schedule.module.css';
import TeamSchedule from './TeamSchedule';
import Infos from './Infos';
import Ranking from './Ranking';
import { useTranslation } from 'react-i18next';

export default function Schedule(props) {
  const { t } = useTranslation();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (value === 1) {
      scheduleClick();
    } else if (value === 2) {
      infosClick();
    } else {
      rankingClick();
    }
  };

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
      <Card className={styles.card}>
        <Container className={styles.titre}>
          <Typography variant="h3">Frisbee Fest</Typography>
          <Typography variant="h5">30-31 Mai</Typography>
          <Typography variant="h5">Trois-Rivière</Typography>
        </Container>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            className={styles.tabs}
            onChange={handleChange}
            centered
          >
            <Tab label={t('schedule')} onClick={scheduleClick} />
            <Tab label="Infos" onClick={infosClick} />
            <Tab label={t('ranking')} onClick={rankingClick} />
          </Tabs>
        </Paper>
      </Card>
      {schedule ? <TeamSchedule /> : <> </>}
      {infos ? <Infos /> : <> </>}
      {ranking ? <Ranking /> : <> </>}
    </Container>
  );
}
