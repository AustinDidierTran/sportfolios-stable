import React, { useEffect, useMemo } from 'react';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { SearchList, List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './Roster.module.css';
import { Typography } from '@material-ui/core';

export default function Roster(props) {
  const { t } = useTranslation();
  const query = useFormInput('');
  const { onClick, roster, setRoster } = props;

  //to allow user to go to next step without roster
  useEffect(() => {
    onClick(null, roster);
  }, [roster]);

  const blackList = useMemo(() => roster.map(r => r.person_id), [
    roster,
  ]);

  const addPerson = (e, person) => {
    if (person.id) {
      setRoster(oldRoster => [
        ...oldRoster,
        {
          person_id: person.id,
          type: GLOBAL_ENUM.ROSTER_ITEM,
          name: person.name,
          secondary: t('player'),
          onDelete,
        },
      ]);
    } else {
      const ids = roster.map(p => {
        if (p.id) {
          return p.id;
        }
        return 0;
      });
      const newId = Math.max(...ids, 0) + 1;
      setRoster(oldRoster => [
        ...oldRoster,
        {
          id: newId,
          type: GLOBAL_ENUM.ROSTER_ITEM,
          name: person.name,
          secondary: t('player'),
          onDelete,
        },
      ]);
    }
  };

  const onDelete = body => {
    const { id, person_id } = body;
    setRoster(oldRoster => {
      if (id) {
        return oldRoster.filter(r => r.id !== id);
      }
      if (person_id) {
        return oldRoster.filter(r => r.person_id !== person_id);
      }
      return oldRoster;
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
        {t(
          'roster_doesnt_have_to_be_final_only_for_pre_ranking_purpose',
        )}
      </Typography>
      <SearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_player_name')}
        type={GLOBAL_ENUM.PERSON}
        onClick={addPerson}
        query={query}
        blackList={blackList}
        secondary={t('player')}
        allowCreate
        withoutIcon
      />
      <hr />
      <Typography style={{ marginTop: '16px' }}>
        {t('roster')}
      </Typography>
      {roster.length === 0 ? (
        <Typography style={{ marginBottom: '32px' }}>
          {t('no_roster')}
        </Typography>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          <List items={roster} />
        </div>
      )}
    </div>
  );
}
