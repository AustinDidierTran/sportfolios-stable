import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'react';

import {
  Paper,
  Card,
  Button,
  List,
  FormDialog,
} from '../../../components/Custom';
import { Container } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';

import styles from './AddOptionsEvent.module.css';
import {
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
  SEVERITY_ENUM,
} from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import moment from 'moment';
import { useFormik } from 'formik';
import { Store, ACTION_ENUM } from '../../../Store';
import {
  formatDate,
  formatPrice,
} from '../../../utils/stringFormats';

export default function AddOptionsEvent() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [options, setOptions] = useState([]);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dialogDesc, setDialogDesc] = useState('');

  const dialogTitle = useMemo(
    () => (isEdit ? t('edit_payment_option') : t('payment_option')),
    [isEdit],
  );

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
    console.log('edit');
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
    setIsEdit(true);
    setOpen(true);
    // getOptions();
  };

  const onDelete = async id => {
    console.log('delete');
    await api(
      formatRoute('/api/entity/option', null, {
        id,
      }),
      {
        method: 'DELETE',
      },
    );
    getOptions();
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
    if (!name) {
      errors.name = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!price && price !== 0) {
      errors.price = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (price < 0) {
      errors.price = t(ERROR_ENUM.VALUE_IS_INVALID);
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
      // add or update

      if (isEdit) {
        console.log('update');
      } else {
        console.log('save');

        if (!hasBankAccount && values.price > 0) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('no_bank_account_linked'),
            severity: SEVERITY_ENUM.ERROR,
          });
        } else {
          console.log('can add');
          addOptionToEvent(values);
          resetForm();
          getOptions();
          onClose();
        }
      }
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

    console.log(values);

    const formattedPrice = Math.floor(Number(price) * 100);
    const start = new Date(`${openDate} ${openTime}`).getTime();
    const end = new Date(`${closeDate} ${closeTime}`).getTime();

    //setIsLoading(true);

    const res = await api(`/api/entity/option`, {
      method: 'POST',
      body: JSON.stringify({
        eventId,
        name,
        price: formattedPrice,
        endTime: end,
        startTime: start,
      }),
    });
    if (res.status === 400) {
      // not even checked ??
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('payment_option_exist'),
        severity: SEVERITY_ENUM.ERROR,
      });
      //setIsLoading(false);
      return;
    }
    //onAddProps();
    //setIsLoading(false);
  };

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'name',
      label: t('name'),
      type: 'text',
      disabled: isEdit,
    },
    {
      namespace: 'price',
      label: `${t('price')} (${t('for_free_option')})`,
      type: 'number',
      initialValue: 0,
      disabled: isEdit,
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
        fields={fields}
        formik={formik}
        buttons={buttons}
      />

      {/*<Container className={styles.container}>
        {options.map((option, index) => (
          <Card
            type={CARD_TYPE_ENUM.EVENT_PAYMENT_OPTION}
            items={{ fields, option, onDelete }}
            key={index}
          />
        ))}
        {/*<Card
          items={{ fields, onAdd, hasBankAccount }}
          type={CARD_TYPE_ENUM.ADD_PAYMENT_OPTION}
        />
      </Container>*/}
    </Paper>
  );
}
