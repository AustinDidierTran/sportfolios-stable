import React, { useState, useMemo } from 'react';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { SearchList, List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './AddTeams.module.css';
import { Typography } from '@material-ui/core';

export default function AddTeams() {
  const { t } = useTranslation();
  const query = useFormInput('');
  const [teams, setTeams] = useState([]);

  const blackList = useMemo(() => teams.map(t => t.team_id), [teams]);

  const addTeam = (e, team) => {
    if (team.id) {
      setTeams(oldTeam => [
        ...oldTeam,
        {
          team_id: team.id,
          type: GLOBAL_ENUM.TEAM,
          name: team.name,
          secondary: t('team'),
          onDelete,
        },
      ]);
    } else {
      const ids = teams.map(t => {
        if (t.id) {
          return t.id;
        }
        return 0;
      });
      const newId = Math.max(...ids, 0) + 1;
      setTeams(oldTeam => [
        ...oldTeam,
        {
          id: newId,
          type: GLOBAL_ENUM.TEAM,
          name: team.name,
          secondary: t('team'),
          onDelete,
        },
      ]);
    }
  };

  const onDelete = body => {
    const { id, team_id } = body;
    setTeams(oldTeam => {
      if (id) {
        return oldTeam.filter(r => r.id !== id);
      }
      if (person_id) {
        return oldTeam.filter(r => r.team_id !== team_id);
      }
      return oldTeam;
    });
  };

  return (
    <div className={styles.main}>
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        style={{ marginBottom: '8px' }}
      >
        {t('add_the_teams_you_want_in_your_tournament')}
      </Typography>
      <SearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_team_name')}
        type={GLOBAL_ENUM.TEAM}
        onClick={addTeam}
        query={query}
        blackList={blackList}
        secondary={t('team')}
        allowCreate
        withoutIcon
      />
      <hr />
      <Typography style={{ marginTop: '16px' }}>
        {t('teams')}
      </Typography>
      {teams.length === 0 ? (
        <Typography style={{ marginBottom: '32px' }}>
          {t('no_teams')}
        </Typography>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          <List items={teams} />
        </div>
      )}
    </div>
  );
}
