import React, { useMemo, useContext } from 'react';
import { SEVERITY_ENUM } from '../../../../../common/enums';
import {
  TeamSearchList,
  List,
  Button,
} from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './AddTeams.module.css';
import { Typography } from '@material-ui/core';
import { Store, ACTION_ENUM } from '../../../Store';

export default function AddTeams(props) {
  const { t } = useTranslation();
  const query = useFormInput('');
  const { dispatch } = useContext(Store);
  const { addTeam, teams, save } = props;

  const blackList = useMemo(() => teams.map(t => t.team_id), [teams]);

  const onSave = () => {
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('teams_saved'),
      severity: SEVERITY_ENUM.SUCCESS,
    });
    save();
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
      <TeamSearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_team_name')}
        onClick={addTeam}
        query={query}
        blackList={blackList}
        secondary={t('team')}
        allowCreate
        withoutIcon
        autoFocus
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
      <Button className={styles.button} onClick={onSave}>
        {t('save')}
      </Button>
    </div>
  );
}
