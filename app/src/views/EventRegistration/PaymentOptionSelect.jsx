import React from 'react';
import { RadioGroup } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import { Typography } from '../../components/MUI';
import styles from './PaymentOptionSelect.module.css';

export default function PaymentOptionSelect(props) {
  const { t } = useTranslation();
  const { onClick, formik } = props;
  const paymentOption = useFormInput('');

  const onChange = (e, value) => {
    paymentOption.onChange(e);
    formik.setFieldValue('paymentOption', value);
    onClick();
  };

  return (
    <div className={styles.main}>
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        style={{ marginBottom: '8px' }}
      >
        {t('registration_can_be_payed_later')}
      </Typography>
      <RadioGroup
        namespace="paymentOptions"
        options={formik.values.paymentOptions}
        title={t('payment_options')}
        {...paymentOption.inputProps}
        onChange={onChange}
      />
    </div>
  );
}
