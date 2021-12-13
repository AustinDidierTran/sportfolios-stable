const applyVictoryRule = (ranking) => {
  const updatedRanking = ranking
    .reduce((prevRanking, currentEntry) => {
      if (!Array.isArray(currentEntry)) {
        // Already sorted, leave it like this
        return [...prevRanking, currentEntry];
      }
      if (currentEntry.length === 1) {
        return [...prevRanking, currentEntry[0]];
      }

      const winSortedArray = [];

      currentEntry.forEach((team) => {
        if (Array.isArray(winSortedArray[team.wins ?? 0])) {
          winSortedArray[team.wins ?? 0].push(team);
        } else {
          winSortedArray[team.wins ?? 0] = [team];
        }
      });
      winSortedArray.reverse();
      if (winSortedArray.length === 1) {
        return [...prevRanking, winSortedArray[0]];
      }
      return [...prevRanking, ...winSortedArray];
    }, [])
    .filter((r) => r);

  return updatedRanking;
};


const applyLoseRule = (ranking) => {
  const updatedRanking = ranking
    .reduce((prevRanking, currentEntry) => {
      if (!Array.isArray(currentEntry)) {
        // Already sorted, leave it like this
        return [...prevRanking, currentEntry];
      }
      if (currentEntry.length === 1) {
        return [...prevRanking, currentEntry[0]];
      }
      const loseSortedArray = [];

      currentEntry.forEach((team) => {
        if (Array.isArray(loseSortedArray[team.loses ?? 0])) {
          loseSortedArray[team.loses ?? 0].push(team);
        } else {
          loseSortedArray[team.loses ?? 0] = [team];
        }
      });
      if (loseSortedArray.length === 1) {
        return [...prevRanking, loseSortedArray[0]];
      }
      return [...prevRanking, ...loseSortedArray];
    }, [])
    .filter((r) => r);
  return updatedRanking;
};

const applyDifferentialRule = (ranking) => {
  const updatedRanking = ranking
    .reduce((prevRanking, currentEntry) => {
      if (!Array.isArray(currentEntry)) {
        // Already sorted, leave it like this
        return [...prevRanking, currentEntry];
      }
      if (currentEntry.length === 1) {
        return [...prevRanking, currentEntry[0]];
      }

      const differentials = currentEntry.map((t) => Number(t.pointAgainst) - Number(t.pointFor));

      const offSet = Math.max(...differentials);

      const differentialSortedArray = [];

      currentEntry.forEach((team) => {
        const index = team.pointFor - team.pointAgainst + offSet;
        if (Array.isArray(differentialSortedArray[index])) {
          differentialSortedArray[index].push(team);
        } else {
          differentialSortedArray[index] = [team];
        }
      });

      differentialSortedArray.reverse();
      if (differentialSortedArray.length === 1) {
        return [...prevRanking, differentialSortedArray[0]];
      }
      return [...prevRanking, ...differentialSortedArray];
    }, [])
    .filter((r) => r);
  return updatedRanking;
};

const applyRandomRule = (ranking) => {
  const updatedRanking = ranking.reduce((prevRanking, currentEntry) => {
    if (!Array.isArray(currentEntry)) {
      // Already sorted, leave it like this
      return [...prevRanking, currentEntry];
    }

    const randomlySortedArray = currentEntry.sort((a, b) => b.random - a.random);

    return [...prevRanking, ...randomlySortedArray];
  }, []);
  return updatedRanking;
};

const applyGameBetweenTeamRules = (games, ranking, prevRankingLength) => {
  const updatedRanking = ranking.reduce((prevRanking, currentEntry) => {
    if (!Array.isArray(currentEntry)) {
      // Already sorted, leave it like this
      return [...prevRanking, currentEntry];
    }
    if (currentEntry.length < 2) {
      return [...prevRanking, currentEntry[0]];
    }

    if (currentEntry.length < prevRankingLength) {
      const teamIds = currentEntry.map((r) => r.ranking_id);

      const interestingGames = games.filter((g) => g.gameTeams.every((team) => teamIds.includes(team.ranking_id)));
      const newRanking = getRankingInfos(interestingGames, currentEntry);

      const newEntry = applyRules(interestingGames, newRanking);

      const mappedEntry = newEntry.map((entry) => {
        if (!Array.isArray(entry)) {
          return currentEntry.find((curr) => curr.ranking_id === entry.ranking_id);
        }

        if (entry.length === 1) {
          return currentEntry.find((curr) => curr.ranking_id === entry[0].ranking_id);
        }

        return entry.map((entry) => currentEntry.find((curr) => curr.ranking_id === entry.ranking_id));
      });

      return [...prevRanking, ...mappedEntry];
    }
    return [...prevRanking, currentEntry];
  }, []);

  return updatedRanking;
};

const applyRules = (games, initialRanking) => {
  const rankingWithVictoryRule = applyVictoryRule(initialRanking);
  const rankingWithLoseRule = applyLoseRule(rankingWithVictoryRule);

  const rankingWithGameBetweenRules = applyGameBetweenTeamRules(games, rankingWithLoseRule, initialRanking[0].length);

  return applyDifferentialRule(rankingWithGameBetweenRules);
};

const getRankingInfos = (games, initialRanking) => {
  const rankings = JSON.parse(JSON.stringify(initialRanking));
  rankings.forEach(ranking => {
    ranking.wins = 0
    ranking.loses = 0;
    ranking.ties = 0;
    ranking.pointFor = 0;
    ranking.pointAgainst = 0;
  })

  const rankingIndex = rankings.reduce((p, r, i) => ({ ...p, [r.ranking_id]: i }), {})
  games.forEach(game => {
    const game0 = game.gameTeams[0];
    const game1 = game.gameTeams[1];
    const phaseRankingGame0 = rankings[rankingIndex[game0.ranking_id]];
    const phaseRankingGame1 = rankings[rankingIndex[game1.ranking_id]];

    phaseRankingGame0.pointFor = (phaseRankingGame0.pointFor ?? 0) + game0.score;
    phaseRankingGame0.pointAgainst = (phaseRankingGame0.pointAgainst ?? 0) + game1.score;
    phaseRankingGame1.pointFor = (phaseRankingGame1.pointFor ?? 0) + game1.score;
    phaseRankingGame1.pointAgainst = (phaseRankingGame1.pointAgainst ?? 0) + game0.score;

    if (game0.score !== null) {
      if (Number(game0.score) > Number(game1.score)) {
        phaseRankingGame0.wins = (phaseRankingGame0.wins ?? 0) + 1
        phaseRankingGame1.loses = (phaseRankingGame1.loses ?? 0) + 1
      }
      else if (Number(game0.score) < Number(game1.score)) {
        phaseRankingGame0.loses = (phaseRankingGame0.loses ?? 0) + 1
        phaseRankingGame1.wins = (phaseRankingGame1.wins ?? 0) + 1
      }
      else {
        phaseRankingGame0.ties = (phaseRankingGame0.ties ?? 0) + 1
        phaseRankingGame1.ties = (phaseRankingGame1.ties ?? 0) + 1
      }
    }
  });
  return [rankings];
}

export const applyAllRules = (games, initialRanking) => {
  const rankings = getRankingInfos(games, initialRanking);
  if (!initialRanking[0].final_position) {
    return applyRandomRule(applyRules(games, rankings));
  }
  return initialRanking.sort((a, b) => a.final_position - b.final_position);
}