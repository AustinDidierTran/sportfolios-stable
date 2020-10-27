import React, { useEffect, useState, useContext } from 'react';

import {
  Paper,
  Button,
  List,
  FormDialog,
  AlertDialog,
  LoadingSpinner,
} from '../../../components/Custom';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';

import styles from './AddOptionsEvent.module.css';
import {
  GLOBAL_ENUM,
  SEVERITY_ENUM,
  STATUS_ENUM,
  FORM_DIALOG_TYPE_ENUM,
} from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../Store';

export default function AddOptionsEvent() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [options, setOptions] = useState([]);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('');

  const [selectedOption, setSelectedOption] = useState({});

  useEffect(() => {
    getOptions();
    getHasBankAccount();
  }, [eventId]);

  const getOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/options', null, { eventId }),
    );
    const dataOptions = data.map(o => ({
      ...o,
      type: GLOBAL_ENUM.EVENT_PAYMENT_OPTION,
      onDelete: onDelete,
      onEdit: onEdit,
      key: o.id,
    }));
    setOptions(dataOptions);
  };

  const getHasBankAccount = async () => {
    const res = await api(
      formatRoute('/api/stripe/eventHasBankAccount', null, {
        id: eventId,
      }),
    );
    setHasBankAccount(res.data);
  };

  const onEdit = option => {
    setSelectedOption(option);
    setSelectedOptionId(option.id);
    setIsEdit(true);
    setOpen(true);
  };

  const onDelete = id => {
    setSelectedOptionId(id);
    setAlertDialog(true);
  };

  const deleteOption = async () => {
    await api(
      formatRoute('/api/entity/option', null, {
        id: selectedOptionId,
      }),
      {
        method: 'DELETE',
      },
    );
    getOptions();
    setAlertDialog(false);
  };

  const onClose = () => {
    setOpen(false);
    setIsEdit(false);
  };

  const addOptionToEvent = async values => {
    const {
      name,
      teamPrice,
      playerPrice,
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
        teamPrice: formattedTeamPrice,
        playerPrice: formattedPlayerPrice,
        startTime: start,
        endTime: end,
      }),
    });
    if (res.status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t(ERROR_ENUM.ERROR_OCCURED),
        severity: SEVERITY_ENUM.ERROR,
      });
      setIsLoading(false);
      return;
    }
    getOptions();
    setIsLoading(false);
  };

  const editOptionEvent = async values => {
    const { openDate, openTime, closeDate, closeTime } = values;

    const start = new Date(`${openDate} ${openTime}`).getTime();
    const end = new Date(`${closeDate} ${closeTime}`).getTime();

    setIsLoading(true);

    const res = await api('/api/entity/updateOption', {
      method: 'PUT',
      body: JSON.stringify({
        id: selectedOptionId,
        start_time: start,
        end_time: end,
      }),
    });

    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('changes_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t(ERROR_ENUM.ERROR_OCCURED),
        severity: SEVERITY_ENUM.ERROR,
      });
      setIsLoading(false);
      return;
    }

    getOptions();
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  return (
    <Paper title={t('add_payment_options')}>
      <Button
        className={styles.addButton}
        endIcon="Add"
        color="primary"
        onClick={() => setOpen(true)}
      >
        {t('add')}
      </Button>
      <List items={options} />

      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_EDIT_EVENT_PAYMENT_OPTION}
        items={{
          open,
          onClose,
          isEdit,
          addOptionToEvent,
          editOptionEvent,
          selectedOption,
          hasBankAccount,
        }}
      />
      <AlertDialog
        open={alertDialog}
        onSubmit={deleteOption}
        onCancel={() => setAlertDialog(false)}
        description={t('delete_payment_option_confirmation')}
        title={t('delete_payment_option')}
      />
    </Paper>
  );
}
