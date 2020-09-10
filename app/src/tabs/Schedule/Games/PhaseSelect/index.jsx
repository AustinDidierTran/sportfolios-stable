import React, { useEffect, useState } from 'react';

import { Select } from '../../../../components/Custom';
import styles from './PhaseSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { useParams } from 'react-router-dom';
import { SELECT_ENUM } from '../../../../../../common/enums';

export default function PhaseSelect(props) {
  const { onChange, phaseId } = props;
  const { t } = useTranslation();
  const { id: eventId } = useParams();

  const [phases, setPhases] = useState([]);

  useEffect(() => {
    getPhases();
  }, []);

  const getPhases = async () => {
    const { data } = await api(
      formatRoute('/api/entity/phases', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.id,
      display: d.name,
    }));

    setPhases([
      { value: SELECT_ENUM.NONE, display: t('none_feminine') },
      ...res,
    ]);
  };

  const handleChange = phaseId => {
    const phase = phases.find(phase => {
      return phase.value === phaseId;
    });
    onChange(phase);
  };

  return (
    <div className={styles.select}>
      <Select
        options={phases}
        namespace="phase"
        autoFocus
        margin="dense"
        label={t('phase')}
        fullWidth
        onChange={handleChange}
        defaultValue={phaseId}
      />
    </div>
  );
}
