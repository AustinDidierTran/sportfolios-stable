import React, { useEffect, useState, useContext } from 'react';
import {
  Paper,
  StepperWithHooks,
  CardMedia,
  IgContainer,
} from '../../components/Custom';
import PaymentOptionSelect from './PaymentOptionSelect';
import TeamSelect from './TeamSelect';
import Roster from './Roster';
import { useStepper } from '../../hooks/forms';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import moment from 'moment';
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
  POSITION_ENUM,
  SEVERITY_ENUM,
} from '../../../../common/enums';
import { formatPrice } from '../../utils/stringFormats';
import styles from './EventRegistration.module.css';
import { Typography } from '../../components/MUI';
import { Container } from '@material-ui/core';
import { Store, SCREENSIZE_ENUM, ACTION_ENUM } from '../../Store';
import { ERROR_ENUM, errors } from '../../../../common/errors';

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
  const [team, setTeam] = useState();
  const [paymentOption, setPaymentOption] = useState();
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [roster, setRoster] = useState([]);
  const [event, setEvent] = useState({});
  const {
    state: { authToken, screenSize },
    dispatch,
  } = useContext(Store);

  const getOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/options', null, { eventId }),
    );

    const options = data
      .filter(
        d =>
          moment(d.start_time) <= moment() &&
          moment(d.end_time) >= moment(),
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
    if (team.id) {
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
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('team_already_registered'),
          severity: SEVERITY_ENUM.ERROR,
          vertical: POSITION_ENUM.TOP,
        });
      }
    } else {
      setTeam(team);
      stepHook.handleCompleted(0);
    }
  };

  const onTeamChange = () => {
    stepHook.handleNotCompleted(0);
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
    if (!team.id) {
      const tempTeam = await api('/api/entity', {
        method: 'POST',
        body: JSON.stringify({
          name: team.name,
          type: GLOBAL_ENUM.TEAM,
        }),
      });
      team.id = tempTeam.data.id;
    }
    //Check if teams is accepted here
    const { status, data } = await api('/api/entity/register', {
      method: 'POST',
      body: JSON.stringify({
        teamId: team.id,
        eventId: eventId,
        paymentOption,
        roster,
        status: INVOICE_STATUS_ENUM.OPEN,
      }),
    });
    if (status === 200) {
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
  };

  const handleNext = activeStep => {
    if (activeStep === 0) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team_selected_add_your_roster', {
          name: team.name,
        }),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 30000,
        vertical: POSITION_ENUM.TOP,
      });
    }
    if (activeStep === 1) {
      let message = '';
      const length = roster.length;
      if (!length) {
        message = t('you_added_no_players_to_your_roster');
      } else if (length === 1) {
        message = t('you_added_one_player_to_your_roster');
      } else {
        message = t('you_added_players_to_your_roster', { length });
      }
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message,
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 30000,
        vertical: POSITION_ENUM.TOP,
      });
    }
  };

  const steps = [
    {
      label: t('team_select'),
      content: (
        <TeamSelect
          onClick={onTeamSelect}
          onTeamChange={onTeamChange}
          team={team}
          eventId={eventId}
        />
      ),
    },
    {
      label: t('roster'),
      content: (
        <Roster
          onClick={onRosterSelect}
          roster={roster}
          setRoster={setRoster}
          team={team}
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
          roster={roster}
        />
      ),
    },
  ];

  const getData = async () => {
    const event = await getEvent(eventId);
    setEvent(event);
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

  return (
    <IgContainer>
      <Paper className={styles.paper}>
        <CardMedia
          onClick={() => goTo(ROUTES.entity, { id })}
          photoUrl={event.photoUrl || ''}
          className={styles.media}
        />
        {screenSize == SCREENSIZE_ENUM.xs ? null : (
          <div className={styles.typo}>
            <Typography>{event.name || ''}</Typography>
          </div>
        )}
        <Container>
          <StepperWithHooks
            steps={steps}
            finish={finish}
            Next={handleNext}
            {...stepHook.stepperProps}
          />
        </Container>
      </Paper>
    </IgContainer>
  );
}
