import React, { useEffect, useState } from 'react';
import { Paper, StepperWithHooks } from '../../components/Custom';
import PaymentOptionSelect from './PaymentOptionSelect';
import TeamSelect from './TeamSelect';
import { useStepper } from '../../hooks/forms';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import moment from 'moment';
import { formatRoute, ROUTES, goTo } from '../../actions/goTo';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EventRegistration() {
  const { t } = useTranslation();
  const { id: event_id } = useParams();
  const [team, setTeam] = useState();
  const [paymentOption, setPaymentOption] = useState();
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [open, setOpen] = useState(false);

  const getOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/options', null, { event_id }),
    );

    const options = data.reduce((prev, d) => {
      if (
        moment(d.start_time) <= moment() &&
        moment(d.end_time).add(24, 'hours') >= moment()
      ) {
        return [
          ...prev,
          {
            display: `${d.name} ${d.price}$`,
            value: d.id,
          },
        ];
      }
      return prev;
    }, []);
    setPaymentOptions(options);
  };

  useEffect(() => {
    getOptions();
  }, [event_id]);

  const stepHook = useStepper();

  const onTeamSelect = async (e, t) => {
    const { data } = await api(
      formatRoute('/api/entity/registered', null, {
        team_id: t.id,
        event_id,
      }),
    );
    if (data.length < 1) {
      setTeam(t);
      stepHook.handleCompleted(0);
    } else {
      setOpen(true);
    }
  };

  const onPaymentOptionSelect = (e, paymentOptionProp) => {
    setPaymentOption(paymentOptionProp);
    stepHook.handleCompleted(1);
  };

  const finish = async () => {
    await api('/api/shop/addCartItem', {
      method: 'POST',
      body: JSON.stringify({
        stripePriceId: paymentOption,
        metadata: team,
      }),
    });
    goTo(ROUTES.cart);
  };

  const steps = [
    {
      label: 'Team select',
      content: <TeamSelect onClick={onTeamSelect} team={team} />,
    },
    {
      label: 'Payment options',
      content: (
        <PaymentOptionSelect
          onClick={onPaymentOptionSelect}
          paymentOption={paymentOption}
          paymentOptions={paymentOptions}
        />
      ),
    },
  ];

  return (
    <Paper title="Event registration">
      <StepperWithHooks
        steps={steps}
        finish={finish}
        {...stepHook.stepperProps}
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Alert
          onClose={() => {
            setOpen(false);
          }}
          severity="error"
        >
          {t('team_already_registered')}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
