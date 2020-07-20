import React, { useState, useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { SearchList, Button } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import TeamItem from '../../components/Custom/List/TeamItem';
import styles from './TeamSelect.module.css';

export default function TeamSelect(props) {
  const { t } = useTranslation();
  const { onClick, team } = props;
  const query = useFormInput('');

  const [selectedTeam, setSelectedTeam] = useState(team);

  useEffect(() => {
    setSelectedTeam(team);
  }, [team]);

  const onChange = () => {
    setSelectedTeam(null);
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
      />
    </div>
  );
}
