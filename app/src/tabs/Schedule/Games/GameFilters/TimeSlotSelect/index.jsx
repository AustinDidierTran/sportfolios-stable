import React, { useEffect, useState } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './TimeSlotSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import { formatRoute } from '../../../../../actions/goTo';
import { useParams } from 'react-router-dom';
import { SELECT_ENUM } from '../../../../../../../common/enums';
import { formatDate } from '../../../../../utils/stringFormats';
import moment from 'moment';

export default function TimeSlotSelect(props) {
  const { onChange, timeSlot } = props;
  const { t } = useTranslation();
  const { id: eventId } = useParams();

  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    getTimeSlots();
  }, []);

  const getTimeSlots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/slots', null, { eventId }),
    );
    const res = data.map(d => ({
      value: d.date,
      display: formatDate(moment(d.date), 'ddd DD MMM h:mm'),
    }));
    setTimeSlots([
      { value: SELECT_ENUM.ALL, display: t('all_time_slots') },
      ...res,
    ]);
  };

  return (
    <div className={styles.select}>
      <Select
        options={timeSlots}
        namespace="time"
        autoFocus
        margin="dense"
        label={t('time_slot')}
        fullWidth
        onChange={onChange}
        value={timeSlot}
      />
    </div>
  );
}
