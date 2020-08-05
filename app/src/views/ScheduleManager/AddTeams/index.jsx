import React, { useMemo } from 'react';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { SearchList, List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './AddTeams.module.css';
import { Typography } from '@material-ui/core';

export default function AddTeams(props) {
  const { t } = useTranslation();
  const query = useFormInput('');
  const { addTeam, teams } = props;

  const blackList = useMemo(() => teams.map(t => t.team_id), [teams]);

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
