import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'react';

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
} from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import moment from 'moment';
import { useFormik } from 'formik';
import { Store, ACTION_ENUM } from '../../../Store';
import { formatPrice } from '../../../utils/stringFormats';

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

  const dialogTitle = useMemo(
    () => (isEdit ? t('edit_payment_option') : t('payment_option')),
    [isEdit],
  );
  const [dialogDesc, setDialogDesc] = useState('');
  const dialogDescMemo = useMemo(() => (isEdit ? dialogDesc : ''), [
    isEdit,
  ]);

  useEffect(() => {
    getOptions();
  }, [eventId]);

  useEffect(() => {
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
    }));

    setOptions(dataOptions);
  };

  const onEdit = async option => {
    setDialogDesc(
      option.name +
        ' | ' +
        (option.price === 0 ? t('free') : formatPrice(option.price)),
    );

    formik.setFieldValue(
      'openDate',
      moment(option.start_time).format('yyyy-MM-DD'),
    );
    formik.setFieldValue(
      'openTime',
      moment(option.start_time).format('HH:mm'),
    );
    formik.setFieldValue(
      'closeDate',
      moment(option.end_time).format('yyyy-MM-DD'),
    );
    formik.setFieldValue(
      'closeTime',
      moment(option.end_time).format('HH:mm'),
    );

    setSelectedOptionId(option.id);
    setIsEdit(true);
    setOpen(true);
  };

  const onDelete = async id => {
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

  const getHasBankAccount = async () => {
    const res = await api(
      formatRoute('/api/stripe/eventHasBankAccount', null, {
        id: eventId,
      }),
    );
    setHasBankAccount(res.data);
  };

  const onClose = () => {
    setOpen(false);
    setIsEdit(false);
    formik.resetForm();
  };

  const validate = values => {
    const {
      name,
      price,
      openDate,
      openTime,
      closeDate,
      closeTime,
    } = values;
    const errors = {};
    if (!isEdit) {
      if (!name) {
        errors.name = t(ERROR_ENUM.VALUE_IS_REQUIRED);
      }
      if (!price && price !== 0) {
        errors.price = t(ERROR_ENUM.VALUE_IS_REQUIRED);
      }
      if (price > 0 && !hasBankAccount) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('no_bank_account_linked'),
          severity: SEVERITY_ENUM.ERROR,
        });
        errors.price = t(ERROR_ENUM.VALUE_IS_INVALID);
      }
      if (price < 0) {
        errors.price = t(ERROR_ENUM.VALUE_IS_INVALID);
      }
    }
    if (!openDate.length) {
      errors.openDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!openTime.length) {
      errors.openTime = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!closeDate.length) {
      errors.closeDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (closeDate < openDate) {
      errors.closeDate = t(ERROR_ENUM.CLOSE_AFTER_OPEN);
    }
    if (!closeTime.length) {
      errors.closeTime = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      openDate: moment().format('YYYY-MM-DD'),
      openTime: '00:00',
      closeDate: '',
      closeTime: '23:59',
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      if (isEdit) {
        editOptionEvent(values);
      } else {
        addOptionToEvent(values);
      }
      resetForm();
      onClose();
    },
  });

  const addOptionToEvent = async values => {
    const {
      name,
      price,
      openDate,
      openTime,
      closeDate,
      closeTime,
    } = values;

    const formattedPrice = Math.floor(Number(price) * 100);
    const start = new Date(`${openDate} ${openTime}`).getTime();
    const end = new Date(`${closeDate} ${closeTime}`).getTime();

    setIsLoading(true);

    const res = await api(`/api/entity/option`, {
      method: 'POST',
      body: JSON.stringify({
        eventId,
        name,
        price: formattedPrice,
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

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: isEdit ? t('edit') : t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'name',
      label: t('name'),
      type: 'text',
    },
    {
      namespace: 'price',
      label: `${t('price')} (${t('for_free_option')})`,
      type: 'number',
      initialValue: 0,
    },
    {
      namespace: 'openDate',
      label: t('registration_open_date'),
      type: 'date',
      initialValue: moment().format('YYYY-MM-DD'),
      shrink: true,
    },
    {
      namespace: 'openTime',
      label: t('registration_open_time'),
      type: 'time',
      initialValue: '00:00',
      shrink: true,
    },
    {
      namespace: 'closeDate',
      label: t('registration_close_date'),
      type: 'date',
      shrink: true,
    },
    {
      namespace: 'closeTime',
      label: t('registration_close_time'),
      type: 'time',
      initialValue: '23:59',
      shrink: true,
    },
  ];

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
        open={open}
        onClose={onClose}
        title={dialogTitle}
        description={dialogDescMemo}
        fields={isEdit ? fields.slice(-4) : fields}
        formik={formik}
        buttons={buttons}
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
