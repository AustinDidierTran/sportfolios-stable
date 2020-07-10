import React, { useState, useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { SearchList, List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './Roster.module.css';
import { TextField, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

export default function Roster(props) {
  const { t } = useTranslation();
  const query = useFormInput('');
  const { onClick } = props;

  const [roster, setRoster] = useState([]);
  const [nameTemp, setNameTemp] = useState('');
  const [blackList, setBlackList] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    onClick(null, roster);
  }, [roster]);

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
    setBlackList(oldBlackList => [
      ...oldBlackList,
      {
        person_id: person.id,
      },
    ]);
  };

  const onDelete = body => {
    const { id, person_id } = body;
    if (person_id) {
      setRoster(oldRoster => {
        const newRoster = oldRoster.filter(
          r => r.person_id !== person_id,
        );
        return newRoster;
      });
      setBlackList(oldBlackList => {
        const newBlackList = oldBlackList.filter(
          r => r.person_id !== person_id,
        );
        return newBlackList;
      });
    } else {
      setRoster(oldRoster => {
        const newRoster = oldRoster.filter(r => r.id !== id);
        return newRoster;
      });
    }
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
        <AddIcon />
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
