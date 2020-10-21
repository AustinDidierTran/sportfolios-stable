const getRankingInfos = (teams, games) => {
  const ranking = teams.map(team => ({
    id: team.id,
    name: team.name,
    wins: 0,
    loses: 0,
    pointFor: 0,
    pointAgainst: 0,
    points: 0,
    random: Math.random(),
  }));

  games.reduce((ranking, game) => {
    const index0 = ranking.findIndex(
      r => r.id === game.teams[0].team_id,
    );
    const index1 = ranking.findIndex(
      r => r.id === game.teams[1].team_id,
    );
    const {
      id: id0,
      name: name0,
      wins: wins0,
      loses: loses0,
      pointFor: pointFor0,
      pointAgainst: pointAgainst0,
      random: random0,
    } = ranking[index0];

    const {
      id: id1,
      name: name1,
      wins: wins1,
      loses: loses1,
      pointFor: pointFor1,
      pointAgainst: pointAgainst1,
      random: random1,
    } = ranking[index1];

    let w0 = wins0;
    let w1 = wins1;
    let l0 = loses0;
    let l1 = loses1;

    if (Number(game.teams[0].score) > Number(game.teams[1].score)) {
      w0 = w0 + 1;
      l1 = l1 + 1;
    }
    if (Number(game.teams[0].score) < Number(game.teams[1].score)) {
      w1 = w1 + 1;
      l0 = l0 + 1;
    }
    ranking[index0] = {
      id: id0,
      name: name0,
      wins: w0,
      loses: l0,
      pointFor: pointFor0 + Number(game.teams[0].score),
      pointAgainst: pointAgainst0 + Number(game.teams[1].score),
      random: random0,
    };
    ranking[index1] = {
      id: id1,
      name: name1,
      wins: w1,
      loses: l1,
      pointFor: pointFor1 + Number(game.teams[1].score),
      pointAgainst: pointAgainst1 + Number(game.teams[0].score),
      random: random1,
    };

    return ranking;
  }, ranking);

  return [ranking];
};

const applyVictoryRule = ranking => {
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

      currentEntry.forEach(team => {
        if (Array.isArray(winSortedArray[team.wins])) {
          winSortedArray[team.wins].push(team);
        } else {
          winSortedArray[team.wins] = [team];
        }
      });
      winSortedArray.reverse();
      if (winSortedArray.length === 1) {
        return [...prevRanking, winSortedArray[0]];
      }
      return [...prevRanking, ...winSortedArray];
    }, [])
    .filter(r => r);

  return updatedRanking;
};

const applyLoseRule = ranking => {
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

      currentEntry.forEach(team => {
        if (Array.isArray(loseSortedArray[team.loses])) {
          loseSortedArray[team.loses].push(team);
        } else {
          loseSortedArray[team.loses] = [team];
        }
      });
      if (loseSortedArray.length === 1) {
        return [...prevRanking, loseSortedArray[0]];
      }
      return [...prevRanking, ...loseSortedArray];
    }, [])
    .filter(r => r);
  return updatedRanking;
};

const applyDifferentialRule = ranking => {
  const updatedRanking = ranking
    .reduce((prevRanking, currentEntry) => {
      if (!Array.isArray(currentEntry)) {
        // Already sorted, leave it like this
        return [...prevRanking, currentEntry];
      }
      if (currentEntry.length === 1) {
        return [...prevRanking, currentEntry[0]];
      }

      const differentials = currentEntry.map(
        t => Number(t.pointAgainst) - Number(t.pointFor),
      );

      const offSet = Math.max(...differentials);

      const differentialSortedArray = [];

      currentEntry.forEach(team => {
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
    .filter(r => r);
  return updatedRanking;
};

const applyRandomRule = ranking => {
  const updatedRanking = ranking.reduce(
    (prevRanking, currentEntry) => {
      if (!Array.isArray(currentEntry)) {
        // Already sorted, leave it like this
        return [...prevRanking, currentEntry];
      }

      const randomlySortedArray = currentEntry.sort(
        (a, b) => b.random - a.random,
      );

      return [...prevRanking, ...randomlySortedArray];
    },
    [],
  );
  return updatedRanking;
};

const applyGameBetweenTeamRules = (
  games,
  ranking,
  prevRankingLength,
) => {
  const updatedRanking = ranking.reduce(
    (prevRanking, currentEntry) => {
      if (!Array.isArray(currentEntry)) {
        // Already sorted, leave it like this
        return [...prevRanking, currentEntry];
      }
      if (currentEntry.length < 2) {
        return [...prevRanking, currentEntry[0]];
      }

      if (currentEntry.length < prevRankingLength) {
        const teamIds = currentEntry.map(r => r.id);

        const interestingGames = games.filter(g =>
          g.teams.every(team => teamIds.includes(team.team_id)),
        );
        const newRanking = getRankingInfos(
          currentEntry,
          interestingGames,
        );

        const newEntry = applyRules(
          interestingGames,
          newRanking,
          prevRankingLength,
        );

        const mappedEntry = newEntry.map(entry => {
          if (!Array.isArray(entry)) {
            return currentEntry.find(curr => curr.id === entry.id);
          }

          if (entry.length === 1) {
            return currentEntry.find(curr => curr.id === entry[0].id);
          }

          return entry.map(entry =>
            currentEntry.find(curr => curr.id === entry.id),
          );
        });

        return [...prevRanking, ...mappedEntry];
      }
      return [...prevRanking, currentEntry];
    },
    [],
  );

  return updatedRanking;
};

const applyRules = (games, initialRanking) => {
  const rankingWithVictoryRule = applyVictoryRule(initialRanking);
  const rankingWithLoseRule = applyLoseRule(rankingWithVictoryRule);

  const rankingWithGameBetweenRules = applyGameBetweenTeamRules(
    games,
    rankingWithLoseRule,
    initialRanking[0].length,
  );

  const rankingWithDifferentialRule = applyDifferentialRule(
    rankingWithGameBetweenRules,
  );

  return rankingWithDifferentialRule;
};

export const updateRanking = (teams, games) => {
  // Filter games that have not been played
  const playedGames = games.filter(game =>
    game.teams.map(t => Number(t.score)).some(score => score !== 0),
  );

  const ranking = getRankingInfos(teams, playedGames);
  const rankingWithAppliedRules = applyRules(
    playedGames,
    ranking,
    ranking[0].length,
  );

  const rankingWithRandom = applyRandomRule(rankingWithAppliedRules);

  return rankingWithRandom;
};
