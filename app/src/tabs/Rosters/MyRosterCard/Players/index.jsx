import React from 'react';
import styles from './Players.module.css';

import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../../common/enums';
import { useFormInput } from '../../../../hooks/forms';
import uuid from 'uuid';

import PlayerCard from './PlayerCard';
import { SearchList } from '../../../../components/Custom';

export default function Players(props) {
  const { t } = useTranslation();
  const { players, role, rosterId, onDelete, onAdd } = props;
  const query = useFormInput('');

  const onPlayerAddToRoster = async (e, person) => {
    const player = person.id
      ? {
          personId: person.id,
          name: person.completeName,
          id: uuid.v1(),
        }
      : { name: person.name, id: uuid.v1() };

    await onAdd(player, rosterId);
  };

  if (!players) {
    return null;
  }

  return (
    <div className={styles.card}>
      <div className={styles.searchList}>
        <SearchList
          clearOnSelect={false}
          label={t('enter_player_name')}
          type={GLOBAL_ENUM.PERSON}
          onClick={onPlayerAddToRoster}
          query={query}
          secondary={t('player')}
          allowCreate
          withoutIcon
          style={{}}
        />
      </div>
      <div className={styles.player}>
        {players.map(player => {
          return (
            <PlayerCard
              player={player}
              role={role}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </div>
  );
}
