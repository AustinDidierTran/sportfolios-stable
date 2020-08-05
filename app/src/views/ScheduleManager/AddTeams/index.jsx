import React, { useState, useMemo, useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { SearchList, List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './AddTeams.module.css';
import { Typography } from '@material-ui/core';
import { goTo, ROUTES } from '../../../actions/goTo';

import uuid from 'uuid';

export default function AddTeams() {
  const { t } = useTranslation();
  const query = useFormInput('');
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    goTo(ROUTES.scheduleManager, null, {
      teams: JSON.stringify(teams),
    });
  }, [teams]);

  const blackList = useMemo(() => teams.map(t => t.team_id), [teams]);

  const addTeam = (e, team) => {
    setTeams(oldTeam => [
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

  const onDelete = id => {
    setTeams(oldTeam => {
      return oldTeam.filter(r => r.id !== id);
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
