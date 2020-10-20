import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { LoadingSpinner } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import PhaseRankings from './PhaseRanking';
import Ranking from './Ranking';
import { updateRanking } from './RankingFunctions';

export default function Rankings() {
  const { id: eventId } = useParams();
  const { t } = useTranslation();

  const [preRanking, setPreRanking] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRankings = async () => {
    const { data } = await api(
      formatRoute('/api/entity/rankings', null, {
        eventId,
      }),
    );
    const ranking = data
      .map(d => ({
        position: d.initial_position,
        name: d.name,
        id: d.team_id,
      }))
      .sort((a, b) => a.position - b.position)
      .map((m, index) => {
        if (!m.position) {
          m.position = index + 1;
        }
        return m;
      });
    setPreRanking(ranking);

    const { data: games } = await api(
      formatRoute('/api/entity/teamGames', null, { eventId }),
    );

    games.map(game => {
      const res1 = ranking.find(r => game.teams[0].team_id === r.id);
      game.teams[0].position = res1.position;

      const res2 = ranking.find(r => game.teams[1].team_id === r.id);
      game.teams[1].position = res2.position;
    });

    const rankingInfos = updateRanking(ranking, games);
    setRanking(rankingInfos);
    setIsLoading(false);
  };

  useEffect(() => {
    getRankings();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!preRanking.length && !ranking.length) {
    return (
      <Typography style={{ margin: '8px' }}>
        {t('no_teams_registered')}
      </Typography>
    );
  }
  return (
    <>
      <Ranking ranking={preRanking} title={t('preranking')}></Ranking>
      <Ranking
        ranking={ranking}
        title={t('ranking')}
        withStats
      ></Ranking>
      <PhaseRankings />
    </>
  );
}
