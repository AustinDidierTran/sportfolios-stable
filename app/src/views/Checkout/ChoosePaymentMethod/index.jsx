import React, { useEffect, useState } from 'react';
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
  const { response } = props;
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const getPaymentMethods = async () => {
    setIsLoading(true);
    const { data } = await api('/api/stripe/paymentMethods');
    data.forEach(d => {
      if (d.is_default) {
        setPaymentMethod(d.payment_method_id);
      }
    });
    const pms = data.map(d => ({
      display: t('card_ending_with', { last4: d.last4 }),
      value: d.payment_method_id,
      last4: d.last4,
    }));
    setPaymentMethods(pms);
    setIsLoading(false);
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const pay = async () => {
    setIsPaying(true);
    const {
      data: {
        invoice: { amount_paid: amountPaid },
        receiptUrl,
      },
      status,
    } = await checkout(paymentMethod);
    if (status === 200) {
      goTo(ROUTES.orderProcessed, null, {
        paid: amountPaid,
        last4: paymentMethods.find(p => p.value === paymentMethod)
          .last4,
        receiptUrl,
      });
    }
    setIsPaying(false);
  };

  const onChange = event => {
    setPaymentMethod(event.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isPaying) {
    return (
      <div>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO_256X256} />
        </div>
        <Typography>{t('waiting_for_payment')}</Typography>
        <LoadingSpinner isComponent />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 16, textAlign: 'center' }}>
      <div className={styles.logo}>
        <img className={styles.img} src={LOGO_ENUM.LOGO_256X256} />
      </div>
      <Typography variant="h6" style={{ marginBottom: '8px' }}>
        {t('amount_to_pay', { amount: formatPrice(response) })}
      </Typography>
      <RadioGroup
        namespace="paymentMethod"
        options={paymentMethods}
        title={t('select_payment_method')}
        onChange={onChange}
        value={paymentMethod}
        centered
      />
      <br />
      {paymentMethods.length ? (
        <>
          <Button
            color="default"
            style={{ margin: '4px' }}
            onClick={() => goTo(ROUTES.userSettings)}
          >
            {t('edit_credit_cards')}
          </Button>
          <Button
            color="default"
            style={{ margin: '4px' }}
            onClick={() =>
              goTo(ROUTES.addPaymentMethod, null, {
                redirect: ROUTES.checkout,
              })
            }
          >
            {t('add_credit_card')}
          </Button>
        </>
      ) : (
        <Button
          color="primary"
          style={{ marginTop: '8px' }}
          onClick={() =>
            goTo(ROUTES.addPaymentMethod, null, {
              redirect: ROUTES.checkout,
            })
          }
        >
          {t('add_credit_card')}
        </Button>
      )}

      <ContainerBottomFixed>
        <Button
          disabled={!paymentMethod}
          onClick={pay}
          style={{ margin: 8 }}
        >
          {t('pay')}
        </Button>
      </ContainerBottomFixed>
    </div>
  );
}
