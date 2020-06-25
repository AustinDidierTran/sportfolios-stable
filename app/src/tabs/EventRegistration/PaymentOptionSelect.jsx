import React, { useCallback } from 'react';
import { RadioGroup } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';

export default function PaymentOptionSelect(props) {
  const { t } = useTranslation();
  const { onClick } = props;
  const paymentOption = useFormInput('');

  const onChange = useCallback(
    e => {
      paymentOption.onChange(e);
      onClick(e);
    },
    [onClick, paymentOption],
  );

  return (
    <RadioGroup
      namespace="paymentOptions"
      options={[{ value: '1', display: 'Prix régulier (80$)' }]}
      title={t('payment_option')}
      {...paymentOption.inputProps}
      onChange={onChange}
    />
  );
}
