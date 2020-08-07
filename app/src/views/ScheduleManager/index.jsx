import React, { useState, useEffect } from 'react';
import { Container, Paper } from '../../components/Custom';
import { TextField } from '../../components/MUI';
import { useTranslation } from 'react-i18next';
import AddTeams from './AddTeams';
import Games from './Games';
import Ranking from './Ranking';
import styles from './ScheduleManager.module.css';
import { goTo, ROUTES } from '../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { useQuery } from '../../hooks/queries';
import uuid from 'uuid';
import { updateRanking } from './RankingFunctions';
import { formatPageTitle } from '../../utils/stringFormats';
import { useFormInput } from '../../hooks/forms';

export default function ScheduleManager() {
  const { t } = useTranslation();
  const { teams, games, ranking, title } = useQuery();

  useEffect(() => {
    document.title = formatPageTitle(getTitle());
  }, [title]);

  const onDelete = id => {
    setTempGames(oldGames =>
      oldGames.filter(
        game => !game.teams.map(g => g.id).includes(id),
      ),
    );
    setTempTeams(oldTeam => {
      return oldTeam.filter(r => r.id !== id);
    });
  };

  const save = () => {
    setTempRanking(updateRanking(tempTeams, tempGames));
    document.title = formatPageTitle(tempTitle.value);
    goTo(ROUTES.scheduleManager, null, {
      teams: JSON.stringify(tempTeams),
      games: JSON.stringify(tempGames),
      ranking: JSON.stringify(tempRanking),
      title: JSON.stringify(tempTitle.value),
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

  const getRanking = () => {
    if (ranking) {
      return JSON.parse(ranking);
    }
    return [];
  };
  const getTitle = () => {
    if (title) {
      return JSON.parse(title);
    }
    return 'Pool Play';
  };

  const [tempGames, setTempGames] = useState(getGames());
  const [tempTeams, setTempTeams] = useState(getTeams());
  const [tempRanking, setTempRanking] = useState(getRanking());
  const tempTitle = useFormInput(getTitle());

  const addTeam = (e, team) => {
    const id = team.id || uuid.v1();
    const games = tempTeams.map((opponent, index) => ({
      id: uuid.v1(),
      teams: [
        {
          id,
          name: team.name,
          score: 0,
          index: tempTeams.length,
        },
        {
          id: opponent.id,
          name: opponent.name,
          score: 0,
          index,
        },
      ],
    }));
    setTempGames(oldGames => [...oldGames, ...games]);
    setTempTeams(oldTeam => [
      ...oldTeam,
      {
        id,
        type: GLOBAL_ENUM.TEAM,
        name: team.name,
        secondary: t('team'),
        onDelete,
        notClickable: true,
      },
    ]);
  };

  const changeScore = (gameIndex, teamIndex, score) => {
    tempGames[gameIndex].teams[teamIndex].score = score;
  };

  return (
    <Paper className={styles.main}>
      <TextField
        className={styles.title}
        size="sm"
        {...tempTitle.inputProps}
      />
      <Container className={styles.container}>
        <AddTeams
          className={styles.teams}
          addTeam={addTeam}
          teams={tempTeams}
          save={save}
        />
        <Games
          className={styles.games}
          games={tempGames}
          changeScore={changeScore}
        />
        <Ranking
          className={styles.ranking}
          ranking={tempRanking}
          games={tempGames}
        />
      </Container>
    </Paper>
  );
}
