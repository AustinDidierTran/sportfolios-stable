import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import Button from '../../../../components/MUI/Button';
import {
  CardActions,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '../../../../components/MUI';
import { Paper } from '../../../../components/Custom';
import styles from './form.module.css';
import CountrySelect from './CountrySelect';
import CurrencySelect from './CurrencySelect';
import api from '../../../../actions/api';

export default function ExternalAccountForm(props) {
  const { t } = useTranslation();
  const { id } = useParams();

  const isANumber = number => isNaN(Number(number));

  const validate = values => {
    const errors = {};
    const {
      country,
      currency,
      accountHolderName,
      routingNumber,
      accountNumber,
    } = values;

    if (!country) {
      errors.country = t('value_is_required');
    }
    if (!currency) {
      errors.currency = t('value_is_required');
    }
    if (!accountHolderName) {
      errors.accountHolderName = t('value_is_required');
    } else if (typeof accountHolderName != 'string') {
      errors.accountHolderName = 'A NAME DOESNT INCLUDE NUMBERS';
    }
    if (!routingNumber) {
      errors.routingNumber = t('value_is_required');
    } else if (isANumber(routingNumber)) {
      errors.routingNumber = 'ONLY NUMBERS';
    }
    if (!accountNumber) {
      errors.accountNumber = t('value_is_required');
    } else if (isANumber(accountNumber)) {
      errors.accountNumber = 'ONLY NUMBERS';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {},
    validate,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async values => {
      const {
        country,
        currency,
        accountHolderName,
        accountNumber,
        routingNumber,
      } = values;

      const params = {
        country: country,
        currency: currency,
        account_holder_name: accountHolderName,
        account_holder_type: 'individual',
        routing_number: routingNumber,
        account_number: accountNumber,
        id: id,
      };
      console.log('params', params);
      const res = await api('/api/stripe/externalAccount', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },
  });

  return (
    <div className={styles.main}>
      <form onSubmit={formik.handleSubmit}>
        <Paper className={styles.card}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Link bank account
            </Typography>
            <CountrySelect formik={formik} />
            <CurrencySelect formik={formik} />
            <TextField
              namespace="accountHolderName"
              formik={formik}
              type="accountHolderName"
              label="Account Holder Name"
              fullWidth
            />
            <TextField
              namespace="routingNumber"
              formik={formik}
              type="routingNumber"
              label="Routing Number"
              fullWidth
            />
            <TextField
              namespace="accountNumber"
              formik={formik}
              type="accountNumber"
              label="Account Number"
              fullWidth
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              type="submit"
            >
              SUBMIT
            </Button>
          </CardActions>
          <Divider />
        </Paper>
      </form>
    </div>
  );
}
