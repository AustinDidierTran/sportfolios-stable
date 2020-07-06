import React, { useEffect, useState } from 'react';

import { Paper, Card } from '../../../components/Custom';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';

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
      display: t('maximum_spots'),
      type: 'number',
      value: 0,
      initialValue: infos.maximum_spots,
    },
    {
      helperText: t('event_start'),
      type: 'date',
      value: 1,
      initialValue: infos.start_date,
    },
    {
      helperText: t('event_end'),
      type: 'date',
      value: 2,
      initialValue: infos.end_date,
    },
  ];

  const onSave = async values => {
    const maximumSpots = values[0].value;
    const eventStart = values[1].value;
    const eventEnd = values[2].value;
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
