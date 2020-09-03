import React, { useEffect, useState } from 'react';

import { Select } from '../../../../components/Custom';
import styles from './FieldSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { useParams } from 'react-router-dom';
import { SELECT_ENUM } from '../../../../../../common/enums';

export default function FieldSelect(props) {
  const { onChange } = props;
  const { t } = useTranslation();
  const { id: eventId } = useParams();

  const [fields, setFields] = useState([]);

  useEffect(() => {
    getFields();
  }, []);

  const getFields = async () => {
    const { data } = await api(
      formatRoute('/api/entity/fields', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.field,
      display: d.field,
    }));
    setFields([
      { value: SELECT_ENUM.NONE, display: t('none') },
      ...res,
    ]);
  };

  return (
    <div className={styles.select}>
      <Select
        options={fields}
        namespace="field"
        autoFocus
        margin="dense"
        label={t('field')}
        fullWidth
        onChange={onChange}
      />
    </div>
  );
}
