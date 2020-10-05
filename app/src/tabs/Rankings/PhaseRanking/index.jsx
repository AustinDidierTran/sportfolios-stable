import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import Ranking from '../Ranking';
import { updateRanking } from '../RankingFunctions';
export default function PhaseRankings() {
  const { id: eventId } = useParams();

  const [phases, setPhases] = useState([]);

  const getPhases = async () => {
    const { data: phases } = await api(
      formatRoute('/api/entity/phases', null, {
        eventId,
      }),
    );
    const res = await Promise.all(
      phases.map(async phase => {
        const { data: games } = await api(
          formatRoute('/api/entity/phasesGameAndTeams', null, {
            eventId,
            phaseId: phase.id,
          }),
        );
        let teams = [];
        let position = 1;
        games.forEach(g => {
          if (
            !teams.filter(team => team.team_id === g.teams[0].team_id)
              .length
          ) {
            teams.push({
              name: g.teams[0].name,
              roster_id: g.teams[0].roster_id,
              id: g.teams[0].team_id,
              position,
            });
            position = position + 1;
          }
          if (
            !teams.filter(team => team.team_id === g.teams[1].team_id)
              .length
          ) {
            teams.push({
              name: g.teams[1].name,
              roster_id: g.teams[1].roster_id,
              id: g.teams[1].team_id,
              position,
            });
            position = position + 1;
          }
        });
        games.map(game => {
          const res1 = teams.find(
            t => game.teams[0].team_id === t.id,
          );
          game.teams[0].position = res1.position;

          const res2 = teams.find(
            t => game.teams[1].team_id === t.id,
          );
          game.teams[1].position = res2.position;
        });
        const ranking = updateRanking(teams, games);
        return { ranking, title: phase.name };
      }),
    );
    setPhases(res);
  };

  useEffect(() => {
    getPhases();
  }, []);
  return (
    <>
      {phases.map(phase => (
        <Ranking
          ranking={phase.ranking}
          title={phase.title}
          withStats
        ></Ranking>
      ))}
    </>
  );
}
