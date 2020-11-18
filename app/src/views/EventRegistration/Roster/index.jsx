import React, { useEffect, useMemo } from 'react';
import { LIST_ITEM_ENUM } from '../../../../../common/enums';
import { List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './Roster.module.css';
import { Typography } from '@material-ui/core';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import PersonSearchListEventRegistration from './PersonSearchListEventRegistration';

export default function Roster(props) {
  const { t } = useTranslation();
  const query = useFormInput('');
  const { onClick, roster, setRoster } = props;

  //to allow user to go to next step without roster
  useEffect(() => {
    onClick(null, roster);
  }, [roster]);
  const blackList = useMemo(() => roster.map(r => r.personId), [
    roster,
  ]);

  const addPerson = async person => {
    if (person.id) {
      const {
        data: { basicInfos: data },
      } = await api(
        formatRoute('/api/entity', null, {
          id: person.id,
        }),
      );
      setRoster(oldRoster => [
        ...oldRoster,
        {
          personId: person.id,
          type: LIST_ITEM_ENUM.ROSTER_ITEM,
          name: person.completeName,
          photoUrl: data.photoUrl,
          secondary: t('player'),
          onDelete: () => {
            onDelete({ personId: person.id });
          },
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
          type: LIST_ITEM_ENUM.ROSTER_ITEM,
          name: person.name,
          surname: person.surname,
          secondary: t('player'),
          email: person.email,
          onDelete: () => {
            onDelete({ id: newId });
          },
        },
      ]);
    }
  };

  const onDelete = body => {
    const { id, personId } = body;
    setRoster(oldRoster => {
      if (id) {
        return oldRoster.filter(r => r.id !== id);
      }
      if (personId) {
        return oldRoster.filter(r => r.personId !== personId);
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
      <PersonSearchListEventRegistration
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_player_name')}
        onClick={addPerson}
        query={query}
        blackList={blackList}
        secondary={t('player')}
        allowCreate
        withoutIcon
        autoFocus
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
