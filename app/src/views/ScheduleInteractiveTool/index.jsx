import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import moment from 'moment';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { formatDate } from '../../utils/stringFormats';
import { Typography } from '../../components/MUI';
import { LoadingSpinner } from '../../components/Custom';
import styles from './ScheduleInteractiveTool.module.css';

export default function ScheduleInteractiveTool() {
  const { id: eventId } = useParams();
  //const [isLoading, setIsLoading] = useState(false);

  // test
  let layout = [
    //{ i: 'b', x: 1, y: 0, w: 1, h: 2, static: true },
    //{ i: 'c', x: 4, y: 0, w: 1, h: 2, static: true },
  ];

  // get gammes
  // get timeSlots
  // get fields

  const getSlots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/slots', null, { eventId }),
    );

    console.log(data);
    const res = data.map(d => ({
      value: d.date,
      display: formatDate(moment(d.date), 'ddd DD MMM HH:mm'),
    }));
    //console.log(res);
    setTimeslots(data);
  };

  const getFields = async () => {
    const { data } = await api(
      formatRoute('/api/entity/fields', null, { eventId }),
    );
    /*const res = data.map(d => ({
      value: d.field,
      display: d.field,
    }));*/

    console.log(data);
    setFields(data);
  };

  useEffect(() => {
    getSlots();
    getFields();
  }, []);

  /*useEffect(() => {
    for (const [i, value] of timeslots.entries()) {
      const gridObj = {
        i: `ts-${i}` /*formatDate(moment(value.date), 'HH:mm')
        x: 0,
        y: i + 1,
        w: 1,
        h: 2,
        static: true,
      };
      layout.push(gridObj);
    }
  }, [timeslots]);

  useEffect(() => {
    for (const [i, value] of fields.entries()) {
      const gridObj = {
        i: `f-${i}` /*value.field,
        x: i + 1,
        y: 0,
        w: 1,
        h: 2,
        static: true,
      };
      layout.push(gridObj);
    }
  }, [fields]);*/

  const [games, setGames] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [fields, setFields] = useState([]);

  if (!timeslots && !fields) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <p>Schedule Interactive Tool</p>
      <GridLayout
        className="layout"
        layout={layout}
        cols={fields?.length + 2}
        rowHeight={timeslots?.length + 2}
        width={window.screen.width}
        style={{ backgroundColor: 'lightgrey' }}
      >
        {timeslots.map((t, index) => (
          <div
            className={styles.timeSlot}
            key={`ts-${index}`}
            data-grid={{
              x: 0,
              y: index + 1,
              w: 0.5,
              h: 2,
              static: true,
            }}
          >
            <Typography>
              {formatDate(moment(t.date), 'HH:mm')}
            </Typography>
          </div>
        ))}
        {fields.map((f, index) => (
          <div
            className={styles.field}
            key={`t-${index}`}
            data-grid={{
              x: index + 1,
              y: 0,
              w: 1,
              h: 2,
              static: true,
            }}
          >
            <Typography>{f.field}</Typography>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
