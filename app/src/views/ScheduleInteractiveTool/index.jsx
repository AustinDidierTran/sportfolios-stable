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
  const [layout, setLayout] = useState();

  // test
  /*let layout = [
    { i: 'f0', x: 1, y: 0, w: 1, h: 2, static: true },
    { i: 'f1', x: 2, y: 0, w: 1, h: 2, static: true },
    { i: 'f2', x: 3, y: 0, w: 1, h: 2, static: true },
    { i: 'f3', x: 4, y: 0, w: 1, h: 2, static: true },

    { i: 'ts0', x: 0, y: 1, w: 0.5, h: 2, minW: 0.5, static: true },
    { i: 'ts1', x: 0, y: 2, w: 0.5, h: 2, minW: 0.5, static: true },
    { i: 'ts2', x: 0, y: 3, w: 0.5, h: 2, minW: 0.5, static: true },
    { i: 'ts3', x: 0, y: 4, w: 0.5, h: 2, minW: 0.5, static: true },
    { i: 'ts4', x: 0, y: 5, w: 0.5, h: 2, minW: 0.5, static: true },
    { i: 'ts5', x: 0, y: 6, w: 0.5, h: 2, minW: 0.5, static: true },
    { i: 'ts6', x: 0, y: 7, w: 0.5, h: 2, minW: 0.5, static: true },
    { i: 'ts7', x: 0, y: 8, w: 0.5, h: 2, minW: 0.5, static: true },
    { i: 'ts8', x: 0, y: 9, w: 0.5, h: 2, minW: 0.5, static: true },
  ];*/

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

  const getGames = async () => {
    const { data } = await api(
      formatRoute('/api/entity/games', null, { eventId }),
    );

    console.log(data);
    setGames(data);
  };

  useEffect(() => {
    getSlots();
    getFields();
    getGames();
  }, []);

  /*useEffect(() => {
    for (const [i, value] of timeslots.entries()) {
      const gridObj = {
        i: `ts${i}`,
        x: 0,
        y: i + 1,
        w: 0.5,
        h: 2,
        minW: 0.5,
        static: true,
      };
      layout.push(gridObj);
    }
  }, [timeslots]);

  useEffect(() => {
    for (const [i, value] of fields.entries()) {
      const gridObj = {
        i: `f${i}`,
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
      <GridLayout
        className={styles.gridLayout}
        //layout={layout}
        cols={fields?.length + 2}
        rowHeight={64}
        width={window.screen.width}
        preventCollision
      >
        {fields.map((f, index) => (
          <div
            className={styles.labelDiv}
            key={`f${index}`}
            data-grid={{
              x: index + 1,
              y: 0,
              w: 1,
              h: 1,
              static: true,
            }}
          >
            <Typography className={styles.label}>
              {f.field}
            </Typography>
          </div>
        ))}
        {timeslots.map((t, index) => (
          <div
            className={styles.labelDiv}
            key={`ts${index}`}
            data-grid={{
              x: 0,
              y: index + 1,
              w: 1,
              h: 1,
              static: true,
            }}
          >
            <Typography className={styles.label}>
              {formatDate(moment(t.date), 'HH:mm')}
            </Typography>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
