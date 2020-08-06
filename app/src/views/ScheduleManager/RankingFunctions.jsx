export function updateRanking(teams, games) {
  const ranking = teams.map(team => ({
    id: team.id,
    name: team.name,
    wins: 0,
    loses: 0,
    pointFor: 0,
    pointAgainst: 0,
    points: 0,
  }));

  games.reduce((ranking, game) => {
    const {
      id: id0,
      name: name0,
      wins: wins0,
      loses: loses0,
      pointFor: pointFor0,
      pointAgainst: pointAgainst0,
    } = ranking[game.teams[0].index];
    const {
      id: id1,
      name: name1,
      wins: wins1,
      loses: loses1,
      pointFor: pointFor1,
      pointAgainst: pointAgainst1,
    } = ranking[game.teams[1].index];

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
    ranking[game.teams[0].index] = {
      id: id0,
      name: name0,
      wins: w0,
      loses: l0,
      pointFor: pointFor0 + Number(game.teams[0].score),
      pointAgainst: pointAgainst0 + Number(game.teams[1].score),
    };
    ranking[game.teams[1].index] = {
      id: id1,
      name: name1,
      wins: w1,
      loses: l1,
      pointFor: pointFor1 + Number(game.teams[1].score),
      pointAgainst: pointAgainst1 + Number(game.teams[0].score),
    };
    return ranking;
  }, ranking);

  return ranking.sort((a, b) => b.wins - a.wins);
}
