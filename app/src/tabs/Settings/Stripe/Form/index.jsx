import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Typography,
  Button,
} from '../../../../components/MUI';
import styles from './form.module.css';
import CountrySelect from './CountrySelect';
import CurrencySelect from './CurrencySelect';
import api from '../../../../actions/api';

export default function ExternalAccountForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    }
    if (!routingNumber) {
      errors.routingNumber = t('value_is_required');
    } else if (isANumber(routingNumber)) {
      errors.routingNumber = t('value_must_be_numeric');
    }
    if (!accountNumber) {
      errors.accountNumber = t('value_is_required');
    } else if (isANumber(accountNumber)) {
      errors.accountNumber = t('value_must_be_numeric');
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {},
    validate,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async values => {
      try {
        setIsSubmitting(true);
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
        await api('/api/stripe/externalAccount', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        setIsSubmitting(false);
      } catch (err) {
        setIsSubmitting(false);
        throw err;
      }
    },
  });

  return (
    <div className={styles.main}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.content}>
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
        </div>
        <div className={styles.actions}>
          <Button
            size="small"
            color="primary"
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}
