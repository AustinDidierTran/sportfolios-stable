import React, { useEffect, useState, useContext } from 'react';
import {
  Paper,
  StepperWithHooks,
  IgContainer,
  LoadingSpinner,
} from '../../components/Custom';
import Roster from './Roster';
import { useStepper } from '../../hooks/forms';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import {
  formatRoute,
  ROUTES,
  goTo,
  goToAndReplace,
} from '../../actions/goTo';
import { useTranslation } from 'react-i18next';
import {
  INVOICE_STATUS_ENUM,
  GLOBAL_ENUM,
  SEVERITY_ENUM,
} from '../../../../common/enums';
import styles from './EventRegistration.module.css';
import { Typography } from '../../components/MUI';
import { Container } from '@material-ui/core';
import { Store, ACTION_ENUM } from '../../Store';
import { ERROR_ENUM, errors } from '../../../../common/errors';
import { useFormik } from 'formik';

import PersonSelect from './PersonSelect';
import PaymentOptionSelect from './PaymentOptionSelect/index';
import TeamSelect from './TeamSelect/index';

const getEvent = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/eventInfos', null, {
      id: eventId,
    }),
  );
  return data;
};

export default function EventRegistration() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const {
    state: { authToken },
    dispatch,
  } = useContext(Store);

  const formik = useFormik({
    initialValues: {
      event: {},
      team: undefined,
      persons: [],
      allPersons: [],
      roster: [],
      paymentOption: '',
      paymentOptions: [],
      teamSearchQuery: '',
      teamActivity: '',
    },
    onSubmit: async values => {
      const {
        event,
        team,
        roster,
        paymentOption,
        persons,
        teamActivity,
      } = values;
      let newTeamId = null;
      setIsLoading(true);
      console.log({ event, team, roster, paymentOption, persons });
      if (teamActivity) {
        if (!team.id) {
          const tempTeam = await api('/api/entity', {
            method: 'POST',
            body: JSON.stringify({
              name: team.name,
              type: GLOBAL_ENUM.TEAM,
            }),
          });
          newTeamId = tempTeam.data.id;
        }
        //Check if team is accepted here
        const { status, data } = await api('/api/entity/register', {
          method: 'POST',
          body: JSON.stringify({
            teamId: newTeamId || team.id,
            eventId: event.id,
            paymentOption,
            roster,
            status: INVOICE_STATUS_ENUM.OPEN,
          }),
        });
        await api('/api/entity/addTeamToSchedule', {
          method: 'POST',
          body: JSON.stringify({
            eventId: event.id,
            name: team.name,
            rosterId: data.rosterId,
          }),
        });

        setIsLoading(false);
        if (status < 300) {
          goTo(ROUTES.registrationStatus, null, {
            status: data.status,
          });
        } else if (
          status === errors[ERROR_ENUM.REGISTRATION_ERROR].code
        ) {
          goTo(ROUTES.registrationStatus, null, {
            status: data.status,
            reason: data.reason,
          });
        }
      } else {
        console.log({ persons });
        const { status, data } = await api(
          '/api/entity/registerIndividual',
          {
            method: 'POST',
            body: JSON.stringify({
              eventId: event.id,
              paymentOption,
              persons: persons,
              status: INVOICE_STATUS_ENUM.OPEN,
            }),
          },
        );
      }
    },
  });

  const stepHook = useStepper();

  // const handleNext = activeStep => {
  //   if (activeStep === 0) {
  //     dispatch({
  //       type: ACTION_ENUM.SNACK_BAR,
  //       message: t('team_selected_add_your_roster', {
  //         name: formik.values.team.name,
  //       }),
  //       severity: SEVERITY_ENUM.SUCCESS,
  //       duration: 30000,
  //       vertical: POSITION_ENUM.TOP,
  //     });
  //   }
  //   if (activeStep === 1) {
  //     let message = '';
  //     const length = formik.values.roster.length;
  //     if (!length) {
  //       message = t('you_added_no_players_to_your_roster');
  //     } else if (length === 1) {
  //       message = t('you_added_one_player_to_your_roster');
  //     } else {
  //       message = t('you_added_players_to_your_roster', { length });
  //     }
  //     dispatch({
  //       type: ACTION_ENUM.SNACK_BAR,
  //       message,
  //       severity: SEVERITY_ENUM.SUCCESS,
  //       duration: 30000,
  //       vertical: POSITION_ENUM.TOP,
  //     });
  //   }
  // };

  useEffect(() => {
    const paymentOption = formik.values.paymentOptions.find(
      p => p.value === formik.values.paymentOption,
    );
    formik.setFieldValue('teamActivity', paymentOption?.teamActivity);
  }, [formik.values.paymentOption]);

  useEffect(() => {
    formik.setFieldValue('teamActivity', true);
  }, []);

  const handleBack = activeStep => {
    stepHook.handleNotCompleted(activeStep);
  };

  const steps = [
    {
      label: t('payment_options'),
      content: (
        <PaymentOptionSelect stepHook={stepHook} formik={formik} />
      ),
    },
    {
      label: t('team_select'),
      content: <TeamSelect stepHook={stepHook} formik={formik} />,
    },
    {
      label: t('roster'),
      content: <Roster stepHook={stepHook} formik={formik} />,
    },
  ];
  const individualSteps = [
    {
      label: t('payment_options'),
      content: (
        <PaymentOptionSelect stepHook={stepHook} formik={formik} />
      ),
    },
    {
      label: t('person_select'),
      content: <PersonSelect formik={formik} stepHook={stepHook} />,
    },
  ];

  const getData = async () => {
    const event = await getEvent(eventId);
    formik.setFieldValue('event', event);
  };

  useEffect(() => {
    const isAuthenticated = Boolean(authToken);
    if (isAuthenticated) {
      getData();
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you_need_to_create_an_account'),
        severity: SEVERITY_ENUM.INFO,
      });
      goToAndReplace(ROUTES.login, null, {
        successRoute: `/eventRegistration/${eventId}`,
      });
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper className={styles.paper}>
        <div className={styles.typo}>
          <Typography variant="h3">
            {formik.values.event.name || ''}
          </Typography>
        </div>
        <Container>
          <StepperWithHooks
            steps={
              formik.values.teamActivity ? steps : individualSteps
            }
            finish={formik.handleSubmit}
            Next={() => {}}
            Back={handleBack}
            {...stepHook.stepperProps}
          />
        </Container>
      </Paper>
    </IgContainer>
  );
}
