import React, { useState, useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { SearchList, Button } from '../../components/Custom';
import { Typography } from '../../components/MUI';
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
  const [whiteList, setWhiteList] = useState([]);

  useEffect(() => {
    setSelectedTeam(team);
  }, [team]);

  useEffect(() => {
    getWhiteList();
  }, [eventId]);

  const onChange = () => {
    setSelectedTeam(null);
    onTeamChange();
  };

  const getWhiteList = async () => {
    const { data: owned } = await api(
      formatRoute('/api/entity/allOwned', null, {
        type: GLOBAL_ENUM.TEAM,
      }),
    );
    const { data: registered } = await api(
      formatRoute('/api/entity/allTeamsRegistered', null, {
        eventId,
      }),
    );

    const registeredIds = registered.map(r => r.teamId);

    const isIncluded = id => {
      return !registeredIds.find(teamId => teamId === id);
    };

    const entities = owned.filter(o => {
      return isIncluded(o.id);
    });
    setWhiteList(entities.map(e => e.id));
  };

  if (selectedTeam) {
    return (
      <div className={styles.main}>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          style={{ marginBottom: '8px' }}
        >
          {t(
            'you_can_always_change_your_team_name_in_your_team_profile',
          )}
        </Typography>
        {team ? (
          <TeamItem
            {...team}
            secondary="Selected Team"
            className={styles.main}
            notClickable
          />
        ) : (
          <TeamItem
            {...selectedTeam}
            secondary="Selected Team"
            className={styles.main}
            notClickable
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
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        style={{ marginBottom: '8px' }}
      >
        {t(
          'you_can_always_change_your_team_name_in_your_team_profile',
        )}
      </Typography>
      <SearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_team_name')}
        type={GLOBAL_ENUM.TEAM}
        onClick={onClick}
        query={query}
        allowCreate
        withoutIcon
        whiteList={whiteList}
      />
    </div>
  );
}
