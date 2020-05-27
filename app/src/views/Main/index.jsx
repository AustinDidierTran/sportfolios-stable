import React, { useEffect, useContext, useState } from 'react';

import styles from './Main.module.css';

import { Container } from '../../components/Custom';

import { useAllMainInformations } from '../../actions/api/helpers';

import { useTranslation } from 'react-i18next';
import FollowingUsersCard from './FollowingUsersCard/index';
import YourEventsCard from './YourEventsCard';
import EventsOfInterest from './EventsOfInterest';
import YourPayments from './YourPayments';
import { EVENT_STATUS_ENUM } from '../Organization/NextEvents';
import OnGoingEvents from './OnGoingEvents';

export default function Main() {
  const { users } = useAllMainInformations();

  const { t } = useTranslation();

  const yourEvents = [
    {
      name: 'Comedy of Errors',
      initial: 'CE',
      date: '19 Juin',
      circuit: 'CQU7',
      place: 'Montréal',
      type: EVENT_STATUS_ENUM.ONGOING,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Qualification CUC ',
      initial: 'Q',
      date: '4 Juillet',
      circuit: 'CQU7',
      place: 'Shawinigan',
      type: EVENT_STATUS_ENUM.ONGOING,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Finale Provinciale',
      initial: 'FP',
      date: '23 Aout',
      circuit: 'CQU7',
      place: 'Laval',
      type: EVENT_STATUS_ENUM.ONGOING,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  const eventsOfInterest = [
    {
      name: 'Jazz',
      initial: 'JZ',
      date: '30 Juin',
      circuit: 'CQU7',
      place: 'Montréal',
      type: EVENT_STATUS_ENUM.REGISTRATION,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  const onGoingEvents = [
    {
      name: 'FrisbeeFest',
      initial: 'FF',
      date: '30 Mai',
      circuit: 'CQU7',
      place: 'Trois-Rivières',
      type: EVENT_STATUS_ENUM.ONGOING,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  const payments = [
    {
      title: 'Primavera',
      subtitle: t('tournament_fee'),
      price: '30$',
    },
    {
      title: 'Frisbee Fest',
      subtitle: t('tournament_fee'),
      price: '25$',
    },
  ];

  return (
    <Container className={styles.container}>
      <YourPayments payments={payments} />
      <OnGoingEvents events={onGoingEvents} />
      <YourEventsCard events={yourEvents} />
    </Container>
  );
}
