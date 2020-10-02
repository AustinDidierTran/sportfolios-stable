import React, { useState, useEffect } from 'react';
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
import { formatRoute } from '../../../../actions/goTo';
import { hasXDigits } from '../../../../utils/validators';

export default function ExternalAccountForm(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setNext } = props;

  const isANumber = number => !isNaN(Number(number));

  const validate = values => {
    const errors = {};
    const {
      country,
      currency,
      accountHolderName,
      transitNumber,
      institutionNumber,
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

    if (!isANumber(transitNumber)) {
      errors.transitNumber = t('value_must_be_numeric');
    } else if (hasXDigits(transitNumber, 5)) {
      errors.transitNumber = t('value_must_have_x_digits', {
        digits: 5,
      });
    }

    if (!isANumber(institutionNumber)) {
      errors.institutionNumber = t('value_must_be_numeric');
    } else if (hasXDigits(institutionNumber, 5)) {
      errors.institutionNumber = t('value_must_have_x_digits', {
        digits: 5,
      });
    }

    if (!accountNumber) {
      errors.accountNumber = t('value_is_required');
    } else if (!isANumber(accountNumber)) {
      errors.accountNumber = t('value_must_be_numeric');
    } else if (hasXDigits(accountNumber, 7)) {
      errors.transitNumber = t('value_must_have_x_digits', {
        digits: 7,
      });
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      country: 'CA',
      currency: 'CAD',
    },
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
          transitNumber,
          institutionNumber,
        } = values;

        const params = {
          country: country,
          currency: currency,
          accountHolderName: accountHolderName,
          transitNumber,
          institutionNumber,
          accountNumber,
          id,
        };
        const res = await api('/api/stripe/externalAccount', {
          method: 'POST',
          body: JSON.stringify(params),
        });

        if (res.status === 403) {
          // There has been an error with Stripe, handle it
        } else {
          setIsSubmitting(false);
          setNext(true);
        }
      } catch (err) {
        setIsSubmitting(false);
        throw err;
      }
    },
  });

  const fetchAccount = async () => {
    const { data: hasStripeBankAccount } = await api(
      formatRoute('/api/stripe/hasStripeBankAccount', null, { id }),
    );
    if (hasStripeBankAccount) {
      setNext(true);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <div className={styles.main}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.content}>
          <Typography gutterBottom variant="h5" component="h2">
            {t('link_bank_account')}
          </Typography>
          <CountrySelect formik={formik} />
          <CurrencySelect formik={formik} />
          <TextField
            namespace="accountHolderName"
            formik={formik}
            type="accountHolderName"
            label={t('account_holder_name')}
            fullWidth
          />
          <TextField
            namespace="transitNumber"
            formik={formik}
            type="number"
            label={t('transit_number')}
            fullWidth
          />
          <TextField
            namespace="institutionNumber"
            formik={formik}
            type="number"
            label={t('institution_number')}
            fullWidth
          />
          <TextField
            namespace="accountNumber"
            formik={formik}
            type="accountNumber"
            label={t('account_number')}
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
            {t('submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
