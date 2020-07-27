import React, { useCallback } from 'react';
import { RadioGroup } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import { Typography } from '../../components/MUI';
import styles from './PaymentOptionSelect.module.css';

export default function PaymentOptionSelect(props) {
  const { t } = useTranslation();
  const { onClick, paymentOptions } = props;
  const paymentOption = useFormInput('');

  const onChange = useCallback(
    (e, value) => {
      paymentOption.onChange(e);
      onClick(e, value);
    },
    [onClick, paymentOption],
  );

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
        options={paymentOptions}
        title={t('payment_options')}
        {...paymentOption.inputProps}
        onChange={onChange}
      />
    </div>
  );
}
