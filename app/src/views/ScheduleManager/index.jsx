import React, { useState, useEffect } from 'react';
import { Container, Button } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import AddTeams from './AddTeams';
import Games from './Games';
import styles from './ScheduleManager.module.css';
import { goTo, ROUTES } from '../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { useQuery } from '../../hooks/queries';
import uuid from 'uuid';

export default function ScheduleManager() {
  const { t } = useTranslation();
  const { teams, games } = useQuery();

  const onDelete = async id => {
    await setTempTeams(oldTeam => {
      return oldTeam.filter(r => r.id !== id);
    });
  };

  const save = () => {
    goTo(ROUTES.scheduleManager, null, {
      teams: JSON.stringify(tempTeams),
      games: JSON.stringify(tempGames),
    });
  };

  const getTeams = () => {
    if (teams) {
      const team = JSON.parse(teams);
      return team.map(t => {
        return { ...t, onDelete };
      });
    }
    return [];
  };

  const getGames = () => {
    if (games) {
      return JSON.parse(games);
    }
    return [];
  };

  const [tempGames, setTempGames] = useState(getGames());
  const [tempTeams, setTempTeams] = useState(getTeams());

  const addTeam = async (e, team) => {
    await setTempTeams(oldTeam => [
      ...oldTeam,
      {
        id: team.id || uuid.v1(),
        type: GLOBAL_ENUM.TEAM,
        name: team.name,
        secondary: t('team'),
        onDelete,
        notClickable: true,
      },
    ]);
  };

  const changeScore = (leftTeamScore, rightTeamScore, id) => {
    const index = tempGames.findIndex(tempGame => tempGame.id === id);
    if (index > -1) {
      tempGames[index].teams[0].score = leftTeamScore;
      tempGames[index].teams[1].score = rightTeamScore;
    }
    save();
  };

  const createGames = () => {
    const games = [];
    tempTeams.forEach((team, teamIndex) => {
      tempTeams.forEach((opponent, opponentIndex) => {
        if (teamIndex < opponentIndex) {
          games.push({
            id: uuid.v1(),
            teams: [
              { id: team.id, name: team.name, score: null },
              { id: opponent.id, name: opponent.name, score: null },
            ],
          });
        }
      });
    });
    setTempGames(games);
  };

  useEffect(() => createGames(), [tempTeams]);

  return (
    <>
      <Typography variant="h4" component="p">
        {t('Welcome to the tournament')}
      </Typography>
      <Container className={styles.container}>
        <AddTeams
          className={styles.teams}
          addTeam={addTeam}
          teams={tempTeams}
        />
        <Games
          className={styles.games}
          games={tempGames}
          changeScore={changeScore}
        />
        <Button className={styles.button} onClick={save}>
          {t('save')}
        </Button>
      </Container>
    </>
  );
}
