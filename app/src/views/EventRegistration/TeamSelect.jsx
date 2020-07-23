import React, { useState, useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { SearchList, Button } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import TeamItem from '../../components/Custom/List/TeamItem';
import styles from './TeamSelect.module.css';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';

export default function TeamSelect(props) {
  const { t } = useTranslation();
  const { onClick, team, eventId, onTeamChange } = props;
  const query = useFormInput('');

  const [selectedTeam, setSelectedTeam] = useState(team);
  const [blackList, setBlackList] = useState([]);

  useEffect(() => {
    setSelectedTeam(team);
  }, [team]);

  useEffect(() => {
    getBlackList();
  }, [eventId]);

  const onChange = () => {
    setSelectedTeam(null);
    onTeamChange();
  };

  const getBlackList = async () => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsRegistered', null, {
        eventId,
      }),
    );
    setBlackList(data.map(d => d.teamId));
  };

  if (selectedTeam) {
    return (
      <div className={styles.main}>
        {team ? (
          <TeamItem
            {...team}
            secondary="Selected Team"
            className={styles.main}
          />
        ) : (
          <TeamItem
            {...selectedTeam}
            secondary="Selected Team"
            className={styles.main}
          />
        )}
        <Button
          className={styles.item}
          size="small"
          variant="contained"
          endIcon="Undo"
          style={{ margin: '8px' }}
          onClick={onChange}
        >
          {t('change_team')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <SearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_team_name')}
        type={GLOBAL_ENUM.TEAM}
        onClick={onClick}
        query={query}
        allowCreate
        withoutIcon
        blackList={blackList}
      />
    </div>
  );
}
