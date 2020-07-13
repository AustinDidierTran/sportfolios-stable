import React, { useState, useEffect, useMemo } from 'react';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { Icon, SearchList, List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './Roster.module.css';
import { TextField, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

export default function Roster(props) {
  const { t } = useTranslation();
  const query = useFormInput('');
  const { onClick, roster, setRoster } = props;

  const [nameTemp, setNameTemp] = useState('');
  const [error, setError] = useState(false);

  //to allow user to go to next step without roster
  useEffect(() => {
    onClick(null, roster);
  }, [roster]);

  const blackList = useMemo(() => roster.map(r => r.person_id), [
    roster,
  ]);

  const addExistingPerson = (e, person) => {
    setRoster(oldRoster => [
      ...oldRoster,
      {
        person_id: person.id,
        type: GLOBAL_ENUM.ROSTER_ITEM,
        name: person.name,
        onDelete,
      },
    ]);
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

  const validate = () => {
    if (nameTemp === '') {
      setError(true);
      return false;
    }
    return true;
  };

  const addPerson = async () => {
    if (!validate()) {
      return;
    }

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
        name: nameTemp,
        onDelete,
      },
    ]);
    setNameTemp('');
  };

  const onChange = () => {
    setNameTemp(event.target.value);
    setError(false);
  };

  return (
    <div className={styles.main}>
      <Typography>{t('add_existing_person')}</Typography>
      <SearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('add_person')}
        type={GLOBAL_ENUM.PERSON}
        onClick={addExistingPerson}
        query={query}
        blackList={blackList}
      />
      <div className={styles.separator}>{t('or')}</div>
      <Typography>{t('add_non_existing_person')}</Typography>
      <TextField
        label={t('full_name')}
        onChange={onChange}
        value={nameTemp}
        error={error}
      />
      <IconButton
        onClick={addPerson}
        color="primary"
        component="span"
      >
        <Icon icon="Add" />
      </IconButton>
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
