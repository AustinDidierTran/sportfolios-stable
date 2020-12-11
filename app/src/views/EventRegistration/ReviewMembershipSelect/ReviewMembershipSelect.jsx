import React, { useCallback } from 'react';
import { RadioGroup } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';

export default function ReviewMembershipSelect(props) {
  const { t } = useTranslation();
  const { onClick, paymentOptions } = props;
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
      options={paymentOptions}
      title={t('payment_option')}
      {...paymentOption.inputProps}
      onChange={onChange}
    />
  );
}
