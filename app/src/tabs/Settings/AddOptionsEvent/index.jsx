import React, { useEffect, useState, useContext } from 'react';
import {
  Paper,
  Button,
  List,
  FormDialog,
  LoadingSpinner,
} from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import styles from './AddOptionsEvent.module.css';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  FORM_DIALOG_TYPE_ENUM,
  LIST_ITEM_ENUM,
} from '../../../../../common/enums';
import { Store, ACTION_ENUM } from '../../../Store';

export default function AddOptionsEvent() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getOptions();
  }, [eventId]);

  const getOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/options', null, { eventId }),
    );
    const dataOptions = data.map(o => ({
      option: o,
      type: LIST_ITEM_ENUM.EVENT_PAYMENT_OPTION,
      update: getOptions,
      key: o.id,
    }));
    setOptions(dataOptions);
  };

  const onClose = () => {
    setOpen(false);
  };

  const addOptionToEvent = async values => {
    const {
      name,
      teamPrice,
      playerPrice,
      ownerId,
      taxRatesId,
      openDate,
      openTime,
      closeDate,
      closeTime,
    } = values;

    const formattedTeamPrice = Math.floor(Number(teamPrice) * 100);
    const formattedPlayerPrice = Math.floor(
      Number(playerPrice) * 100,
    );
    const start = new Date(`${openDate} ${openTime}`).getTime();
    const end = new Date(`${closeDate} ${closeTime}`).getTime();

    setIsLoading(true);
    const res = await api(`/api/entity/option`, {
      method: 'POST',
      body: JSON.stringify({
        eventId,
        name,
        ownerId,
        taxRatesId,
        teamPrice: formattedTeamPrice,
        playerPrice: formattedPlayerPrice,
        startTime: start,
        endTime: end,
      }),
    });
    if (res.status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
      setIsLoading(false);
      return;
    }
    getOptions();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Paper title={t('payment_options')}>
        <LoadingSpinner isComponent />
      </Paper>
    );
  }

  return (
    <Paper title={t('payment_options')}>
      <Button
        className={styles.addButton}
        color="primary"
        onClick={() => setOpen(true)}
      >
        {t('add_payment_option')}
      </Button>
      <List items={options} />
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_EVENT_PAYMENT_OPTION}
        items={{
          open,
          onClose,
          addOptionToEvent,
        }}
      />
    </Paper>
  );
}
