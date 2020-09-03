import React, { useEffect, useState } from 'react';

import { Select } from '../../../../components/Custom';
import styles from './TeamSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { useParams } from 'react-router-dom';
import { SELECT_ENUM } from '../../../../../../common/enums';

export default function TeamSelect(props) {
  const { onChange } = props;
  const { t } = useTranslation();
  const { id: eventId } = useParams();

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getTeams();
  }, []);

  const getTeams = async () => {
    const { data } = await api(
      formatRoute('/api/entity/teamsSchedule', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.name,
      display: d.name,
    }));

    setTeams([
      { value: SELECT_ENUM.NONE, display: t('none_feminine') },
      ...res,
    ]);
  };

  return (
    <div className={styles.select}>
      <Select
        options={teams}
        namespace="team"
        autoFocus
        margin="dense"
        label={t('team')}
        fullWidth
        onChange={onChange}
      />
    </div>
  );
}
