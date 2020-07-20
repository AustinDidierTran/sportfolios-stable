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
      <SearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_person_name')}
        type={GLOBAL_ENUM.PERSON}
        onClick={addPerson}
        query={query}
        blackList={blackList}
        allowCreate
        withoutIcon
      />
      <hr />
      <Typography style={{ marginTop: '16px' }}>
        {t('roster')}
      </Typography>
      {roster.length === 0 ? (
        <Typography>{t('no_roster')}</Typography>
      ) : (
        <List items={roster} />
      )}
    </div>
  );
}
