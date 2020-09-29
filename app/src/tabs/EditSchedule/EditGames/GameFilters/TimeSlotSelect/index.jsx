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
  const { onChange, timeSlot, onlyPast: onlyPastProps } = props;
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const [timeSlots, setTimeSlots] = useState([]);
  const [onlyPast, setOnlyPast] = useState(onlyPastProps);

  useEffect(() => {
    getTimeSlots();
  }, []);

  useEffect(() => {
    setOnlyPast(onlyPastProps);
  }, [onlyPastProps]);

  const getTimeSlots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/slots', null, { eventId }),
    );

    const mapped = data
      .map(d => ({
        value: moment(d.date).format('YYYY M D'),
        display: formatDate(moment(d.date), 'DD MMM'),
      }))
      .reduce((prev, curr) => {
        if (prev) {
          if (!prev.map(p => p.value).includes(curr.value)) {
            return [...prev, curr];
          }
          return prev;
        }
      }, []);

    if (onlyPast) {
      const res = mapped.filter(m => {
        return moment(m.value).add(1, 'day') < moment();
      });

      setTimeSlots([
        { value: SELECT_ENUM.ALL, display: t('all_time_slots') },
        ...res,
      ]);
    } else {
      const res = mapped.filter(
        m => moment(m.value).add(1, 'day') > moment(),
      );
      setTimeSlots([
        { value: SELECT_ENUM.ALL, display: t('all_time_slots') },
        ...res,
      ]);
    }
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
