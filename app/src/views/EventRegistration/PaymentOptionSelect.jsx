import React, { useCallback } from 'react';
import { RadioGroup } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';

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
    <RadioGroup
      namespace="paymentOptions"
      options={paymentOptions}
      title={t('payment_options')}
      {...paymentOption.inputProps}
      onChange={onChange}
    />
  );
}
