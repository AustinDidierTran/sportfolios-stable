import React, { useState } from 'react';
import { Paper, StepperWithHooks } from '../../components/Custom';
import PaymentOptionSelect from './PaymentOptionSelect';
import TeamSelect from './TeamSelect';
import { useStepper } from '../../hooks/forms';

export default function EventRegistration() {
  const [team, setTeam] = useState();
  const [paymentOption, setPaymentOption] = useState();
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
