import React, { useState } from 'react';

import styles from './PersonnalInformation.module.css';
import api from '../../../actions/api';

import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../Store';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import {
  TextField,
  Typography,
  Button,
} from '../../../components/MUI';
import CountrySelect from '../../Entity/Settings/Stripe/Form/CountrySelect';

export async function createCustomer(params) {
  const res = await api('/api/stripe/createCustomer', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  /* eslint-disable-next-line */
  console.log('createCustomer', res);
}

export default function CustomerForm(props) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);
  const { setNext } = props;

  const isANumber = number => isNaN(Number(number));

  const validate = values => {
    const errors = {};
    const {
      name,
      email,
      phoneNumber,
      line1,
      city,
      country,
      state,
      postalCode,
    } = values;

    if (!name) {
      errors.name = t('value_is_required');
    }
    if (!email) {
      errors.email = t('value_is_required');
    }
    if (!phoneNumber) {
      errors.phoneNumber = t('value_is_required');
    } else if (isANumber(phoneNumber)) {
      errors.phoneNumber = t('value_must_be_numeric');
    }
    if (!line1) {
      errors.line1 = t('value_is_required');
    }
    if (!city) {
      errors.city = t('value_is_required');
    }
    if (!country) {
      errors.country = t('value_is_required');
    }
    if (!state) {
      errors.state = t('value_is_required');
    }
    if (!postalCode) {
      errors.postalCode = t('value_is_required');
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
          name,
          email,
          phoneNumber,
          line1,
          line2,
          city,
          country,
          state,
          postalCode,
        } = values;

        const params = {
          customer: {
            address: {
              line1: line1,
              city: city,
              country: country, //2 letter country code (ISO)
              line2: line2,
              postal_code: postalCode,
              state: state, //2 letter state code (ISO)
            },
            description: userInfo.user_id,
            email: email,
            name: name,
            phone: phoneNumber,
            shipping: {
              address: {
                line1: line1,
                city: city,
                country: country, //2 letter country code (ISO)
                line2: line2,
                postal_code: postalCode,
                state: state, //2 letter state code (ISO)
              },
              name: name,
              phone: phoneNumber,
            },
            // ...customer, payment_method: id
          },
        };

        dispatch({
          type: ACTION_ENUM.UPDATE_USER_INFO,
          payload: { ...userInfo, ...params },
        });
        createCustomer(params);
        setIsSubmitting(false);
        setNext(true);
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
          <TextField
            namespace="name"
            formik={formik}
            type="name"
            label="Name"
            fullWidth
          />
          <TextField
            namespace="email"
            formik={formik}
            type="email"
            label="Email"
            fullWidth
          />
          <TextField
            namespace="phoneNumber"
            formik={formik}
            type="phoneNumber"
            label="Phone Number"
            fullWidth
          />
          <Typography gutterBottom variant="h5" component="h2">
            Address
          </Typography>
          <TextField
            namespace="line1"
            formik={formik}
            type="line1"
            label="Line 1"
            fullWidth
          />
          <TextField
            namespace="line2"
            formik={formik}
            type="line2"
            label="Line 2"
            fullWidth
          />
          <TextField
            namespace="city"
            formik={formik}
            type="city"
            label="City"
            fullWidth
          />
          <CountrySelect formik={formik} />
          <TextField
            namespace="state"
            formik={formik}
            type="state"
            label="State"
            fullWidth
          />
          <TextField
            namespace="postalCode"
            formik={formik}
            type="postalCode"
            label="Postal Code"
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
