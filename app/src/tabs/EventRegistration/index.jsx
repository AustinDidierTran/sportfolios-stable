import React, { useEffect, useState } from 'react';
import { Paper, StepperWithHooks } from '../../components/Custom';
import PaymentOptionSelect from './PaymentOptionSelect';
import TeamSelect from './TeamSelect';
import Roster from './Roster';
import { useStepper } from '../../hooks/forms';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import moment from 'moment';
import { formatRoute, ROUTES, goTo } from '../../actions/goTo';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import { INVOICE_STATUS_ENUM } from '../../../../common/enums';
import { formatPrice } from '../../utils/stringFormats';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EventRegistration() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const [team, setTeam] = useState();
  const [paymentOption, setPaymentOption] = useState();
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [roster, setRoster] = useState([]);
  const [open, setOpen] = useState(false);

  const getOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/options', null, { eventId }),
    );

    const options = data
      .filter(
        d =>
          moment(d.start_time) <= moment() &&
          moment(d.end_time).add(24, 'hours') >= moment(),
      )
      .reduce(
        (prev, d) => [
          ...prev,
          {
            display: `${d.name} ${formatPrice(d.price)}`,
            value: d.id,
          },
        ],
        [],
      );

    setPaymentOptions(options);
  };

  useEffect(() => {
    getOptions();
  }, [eventId]);

  const stepHook = useStepper();

  const onTeamSelect = async (e, team) => {
    const { data } = await api(
      formatRoute('/api/entity/registered', null, {
        team_id: team.id,
        event_id: eventId,
      }),
    );
    if (data.length < 1) {
      setTeam(team);
      stepHook.handleCompleted(0);
    } else {
      setOpen(true);
    }
  };

  const onRosterSelect = (e, roster) => {
    setRoster(roster);
    stepHook.handleCompleted(1);
  };

  const onPaymentOptionSelect = (e, paymentOptionProp) => {
    setPaymentOption(paymentOptionProp);
    stepHook.handleCompleted(2);
  };

  const finish = async () => {
    await api('/api/shop/addCartItem', {
      method: 'POST',
      body: JSON.stringify({
        stripePriceId: paymentOption,
        metadata: { sellerId: eventId, buyerId: team.id, team },
      }),
    });
    const { data } = await api('/api/entity/register', {
      method: 'POST',
      body: JSON.stringify({
        team_id: team.id,
        event_id: eventId,
        invoice_id: null,
        status: INVOICE_STATUS_ENUM.OPEN,
      }),
    });

    await api('/api/entity/roster', {
      method: 'POST',
      body: JSON.stringify({
        rosterId: data.roster_id,
        roster,
      }),
    });
    goTo(ROUTES.cart);
  };

  const steps = [
    {
      label: t('team_select'),
      content: <TeamSelect onClick={onTeamSelect} team={team} />,
    },
    {
      label: t('roster'),
      content: (
        <Roster
          onClick={onRosterSelect}
          roster={roster}
          setRoster={setRoster}
        />
      ),
    },
    {
      label: t('payment_options'),
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
