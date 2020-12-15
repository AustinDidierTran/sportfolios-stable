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
  STATUS_ENUM,
  REJECTION_ENUM,
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
        return;
      }
      const { status, data } = await api(
        '/api/entity/registerIndividual',
        {
          method: 'POST',
          body: JSON.stringify({
            eventId: event.id,
            paymentOption,
            persons,
            status: INVOICE_STATUS_ENUM.OPEN,
          }),
        },
      );
      if (status === STATUS_ENUM.SUCCESS) {
        goTo(ROUTES.registrationStatus, null, {
          status: data.status,
        });
        return;
      }
      if (data.reason === REJECTION_ENUM.ALREADY_REGISTERED) {
        const names = data.persons.reduce((prev, curr, index) => {
          if (index === 0) {
            return prev + curr.name;
          } else {
            return `${prev} ${t('and_lowerCased')} ${curr.name}`;
          }
        }, '');
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message:
            data.persons.length === 1
              ? t('already_registered_singular', { names })
              : t('already_registered', { names }),
          severity: SEVERITY_ENUM.ERROR,
          duration: 6000,
        });
        setIsLoading(false);
        return;
      }
      goTo(ROUTES.registrationStatus, null, {
        status: data.status,
        reason: data.reason,
      });

      setIsLoading(false);
    },
  });

  const stepHook = useStepper();

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
