import React, { useEffect, useState } from 'react';
import { Paper, StepperWithHooks } from '../../components/Custom';
import PaymentOptionSelect from './PaymentOptionSelect';
import TeamSelect from './TeamSelect';
import { useStepper } from '../../hooks/forms';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import moment from 'moment';

export default function EventRegistration() {
  const { id } = useParams();
  const [team, setTeam] = useState();
  const [paymentOption, setPaymentOption] = useState();
  const [paymentOptions, setPaymentOptions] = useState([]);

  const getOptions = async () => {
    const res = await api(`/api/entity/options/?id=${id}`);
    const data = [];
    res.data.map(d => {
      if (
        moment(d.start_time) <= moment() &&
        moment(d.end_time).add(24, 'hours') >= moment()
      ) {
        data.push({
          display: `${d.name} ${d.price}$`,
          value: d.id,
        });
      }
    });
    setPaymentOptions(data);
  };

  useEffect(() => {
    getOptions();
  }, [id]);

  const stepHook = useStepper();
  const onTeamSelect = (e, t) => {
    setTeam(t);
    stepHook.handleCompleted(0);
    stepHook.handleNext();
  };

  const onPaymentOptionSelect = (e, paymentOptionProp) => {
    setPaymentOption(paymentOptionProp), stepHook.handleCompleted(1);
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
      <StepperWithHooks steps={steps} {...stepHook.stepperProps} />
    </Paper>
  );
}
