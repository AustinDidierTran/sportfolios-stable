USER

TEAM

SEASON

user_to_team

user_to_team_requests

season_to_team


select * from seasons INNER JOIN
season_to_team ON season_to_team.seasonId = seasons.id INNER JOIN
teams ON season_to_team.teamId = teams.id INNER JOIN
user_to_team ON user_to_team.teamId = teams.id INNER JOIN
users ON user_to_team.userId = users.id WHERE seasons.id = searchedSeasonId;




user

id
