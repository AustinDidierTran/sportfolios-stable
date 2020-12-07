import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import moment from 'moment';
import BasicFormDialog from '../BasicFormDialog';
import {
  COMPONENT_TYPE_ENUM,
  SEVERITY_ENUM,
} from '../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../Store';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { useParams } from 'react-router-dom';

export default function AddEventPaymentOption(props) {
  const { open, onClose, addOptionToEvent } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const [ownersId, setOwnersId] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [allTaxes, setAllTaxes] = useState([]);
  const [teamActivity, setTeamActivity] = useState(true);
  const { id: eventId } = useParams();

  const getAccounts = async () => {
    const { data } = await api(
      formatRoute('/api/stripe/eventAccounts', null, { eventId }),
    );
    const res = data.map(r => ({
      value: r.id,
      display: `${r?.name} ${r?.surname}`,
      key: r.id,
    }));
    setOwnersId(res);
    if (res[0]) {
      formik.setFieldValue('ownerId', res[0].value);
    }
  };

  const getTaxes = async () => {
    const { data } = await api(formatRoute('/api/stripe/getTaxes'));
    const res = data.map(d => ({
      id: d.id,
      percentage: d.percentage,
      display: `${d.display_name} ${d.percentage} %`,
    }));
    setAllTaxes(res);
  };

  const handleChange = value => {
    setTaxes(value);
  };

  useEffect(() => {
    getAccounts();
    getTaxes();
  }, [open]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    const {
      name,
      teamPrice,
      playerPrice,
      ownerId,
      openDate,
      openTime,
      closeDate,
      closeTime,
    } = values;
    const errors = {};
    if (!name) {
      errors.name = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!teamPrice && teamPrice !== 0) {
      errors.teamPrice = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (teamPrice > 0 && !ownerId) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no_bank_account_linked'),
        severity: SEVERITY_ENUM.ERROR,
      });
      errors.teamPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (teamPrice < 0) {
      errors.teamPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (!playerPrice && playerPrice !== 0) {
      errors.playerPrice = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (playerPrice > 0 && !ownerId) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no_bank_account_linked'),
        severity: SEVERITY_ENUM.ERROR,
      });
      errors.playerPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (playerPrice < 0) {
      errors.playerPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
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
    if (closeDate === openDate && closeTime < openTime) {
      errors.closeTime = t(ERROR_ENUM.CLOSE_AFTER_OPEN);
    }
    if (!closeTime.length) {
      errors.closeTime = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      teamPrice: '',
      playerPrice: '',
      ownerId: ``,
      openDate: moment().format('YYYY-MM-DD'),
      openTime: '00:00',
      closeDate: moment()
        .add(1, 'month')
        .format('YYYY-MM-DD'),
      closeTime: '23:59',
    },
    validate,
    validateOnChange: false,
    onSubmit: values => {
      const taxRatesId = allTaxes
        .filter(t => taxes.includes(t.display))
        .map(t => t.id);
      addOptionToEvent({ ...values, taxRatesId, teamActivity });
      onClose();
    },
  });

  useEffect(() => {
    if (!teamActivity) {
      formik.setFieldValue('teamPrice', 0);
    }
  }, [teamActivity]);

  const onChange = () => {
    setTeamActivity(!teamActivity);
  };

  const getPriceWithTax = (amount, taxes) => {
    return Math.ceil(
      taxes.reduce((prev, curr) => {
        return prev + prev * (curr / 100);
      }, amount),
    );
  };

  const teamPriceTotal = useMemo(() => {
    const formatted = allTaxes
      .filter(t => taxes.includes(t.display))
      .map(t => t.percentage);
    return (
      getPriceWithTax(formik.values.teamPrice * 100, formatted) / 100
    );
  }, [formik.values.teamPrice, taxes]);

  const playerPriceTotal = useMemo(() => {
    const formatted = allTaxes
      .filter(t => taxes.includes(t.display))
      .map(t => t.percentage);

    return (
      getPriceWithTax(formik.values.playerPrice * 100, formatted) /
      100
    );
  }, [formik.values.playerPrice, taxes]);

  const fields = [
    {
      namespace: 'name',
      label: t('name'),
      type: 'text',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
      checked: teamActivity,
      namespace: 'teamActivity',
      label: t('team_activity'),
      onChange: onChange,
    },
    teamActivity
      ? {
          namespace: 'teamPrice',
          label: t('price_team'),
          type: 'number',
          endAdorment: '$',
        }
      : { componentType: COMPONENT_TYPE_ENUM.EMPTY },
    teamActivity
      ? {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          secondary: t('with_taxes_the_total_for_a_team_is', {
            total: teamPriceTotal,
          }),
        }
      : { componentType: COMPONENT_TYPE_ENUM.EMPTY },
    {
      namespace: 'playerPrice',
      label: t('price_individual'),
      type: 'number',
      endAdorment: '$',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      secondary: t('with_taxes_the_total_for_a_player_is', {
        total: playerPriceTotal,
      }),
    },
    ownersId.length
      ? {
          namespace: 'ownerId',
          label: t('payment_option_owner'),
          componentType: COMPONENT_TYPE_ENUM.SELECT,
          options: ownersId,
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primary: t('no_admins_with_bank_account'),
        },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      secondary: t(
        'all_the_admins_of_the_event_that_have_a_bank_account_linked_to_their_account_will_appear_here',
      ),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.MULTISELECT,
      namespace: 'taxes',
      label: t('taxes'),
      options: allTaxes.map(a => a.display),
      values: taxes,
      onChange: handleChange,
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
  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];
  return (
    <BasicFormDialog
      open={open}
      title={t('payment_option')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
