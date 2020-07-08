import React, { useEffect, useState } from 'react';

import { Paper, Card } from '../../../components/Custom';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import moment from 'moment';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EventSettings() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const { id: eventId } = useParams();

  const [infos, setInfos] = useState({});

  const getInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/event', null, {
        eventId,
      }),
    );
    setInfos(data);
  };

  useEffect(() => {
    getInfos();
  }, [eventId]);

  const fields = [
    {
      helperText: t('maximum_spots'),
      type: 'number',
      initialValue: infos.maximum_spots,
    },
    {
      helperText: t('event_start'),
      type: 'date',
      initialValue: moment(infos.start_date).format('YYYY-MM-DD'),
    },
    {
      helperText: t('event_end'),
      type: 'date',
      initialValue: moment(infos.end_date).format('YYYY-MM-DD'),
    },
  ];

  const onSave = async values => {
    const [
      { value: maximumSpots },
      { value: eventStart },
      { value: eventEnd },
    ] = values;
    await api(`/api/entity/updateEvent`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        maximumSpots,
        eventStart,
        eventEnd,
      }),
    });
    getInfos();
  };

  return (
    <Paper title={t('event_settings')}>
      <Card
        items={{ fields, onSave }}
        type={CARD_TYPE_ENUM.EVENT_SETTINGS}
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Alert
          onClose={() => {
            setOpen(false);
          }}
          severity="error"
        >
          {'heille'}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
