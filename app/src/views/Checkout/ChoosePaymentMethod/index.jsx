import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../actions/api';
import {
  Button,
  RadioGroup,
  LoadingSpinner,
  ContainerBottomFixed,
} from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { checkout } from '../../../utils/stripe';
import styles from './ChoosePaymentMethod.module.css';
import { Typography } from '../../../components/MUI';
import { LOGO_ENUM } from '../../../../../common/enums';
import { formatPrice } from '../../../utils/stringFormats';

export default function ChoosePaymentMethod(props) {
  const { paymentMethod, response } = props;
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPaymentMethods = async () => {
    const { data } = await api('/api/stripe/paymentMethods');
    const pms = data.map(d => ({
      display: t('card_ending_with', { last4: d.last4 }),
      value: d.payment_method_id,
      last4: d.last4,
    }));
    setPaymentMethods(pms);
    if (paymentMethod) paymentMethod.changeDefault(pms[0].value);
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const paymentDisabled = useMemo(
    () => !Boolean(paymentMethod.value),
    [paymentMethod.value],
  );

  const pay = async () => {
    setIsLoading(true);
    const {
      data: {
        invoice: { amount_paid: amountPaid },
        receiptUrl,
      },
      status,
    } = await checkout(paymentMethod.value);

    if (status === 200) {
      goTo(ROUTES.orderProcessed, null, {
        paid: amountPaid,
        last4: paymentMethods.find(
          p => p.value === paymentMethod.value,
        ).last4,
        receiptUrl,
      });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  if (!paymentMethods.length) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO} />
        </div>
        <Typography variant="h6">
          {t('amount_to_pay', { amount: formatPrice(response) })}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          style={{ margin: '8px' }}
        >
          {t('no_payment_method')}
        </Typography>
        <Button
          style={{ textAlign: 'center' }}
          onClick={() => goTo(ROUTES.addPaymentMethod)}
        >
          {t('add_payment_method')}
        </Button>
      </div>
    );
  }

  if (!paymentMethod.value) {
    return <></>;
  }

  return (
    <div style={{ paddingBottom: 16, textAlign: 'center' }}>
      <div className={styles.logo}>
        <img className={styles.img} src={LOGO_ENUM.LOGO} />
      </div>
      <Typography variant="h6" style={{ marginBottom: '8px' }}>
        {t('amount_to_pay', { amount: formatPrice(response) })}
      </Typography>
      <RadioGroup
        namespace="paymentMethod"
        options={paymentMethods}
        title={t('select_payment_method')}
        {...paymentMethod.inputProps}
      />
      <br />
      <Button
        style={{
          textAlign: 'center',
          backgroundColor: paymentMethods.length
            ? 'lightGrey'
            : 'primary',
        }}
        onClick={() => goTo(ROUTES.addPaymentMethod)}
      >
        {t('add_payment_method')}
      </Button>

      <ContainerBottomFixed>
        <Button
          disabled={paymentDisabled}
          onClick={pay}
          style={{ margin: 8 }}
        >
          Payer
        </Button>
      </ContainerBottomFixed>
    </div>
  );
}
