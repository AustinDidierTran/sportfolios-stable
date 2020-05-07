import React, { useEffect, useContext, useState } from 'react';

import styles from './Main.module.css';

import { Card, CardContent, Container } from '../../components/MUI';
import api from '../../actions/api';
import { useAllMainInformations } from '../../actions/api/helpers';
import { Store } from '../../Store';

import FollowingUsersCard from './FollowingUsersCard/index';

export default function Main(props) {
  const { users } = useAllMainInformations();

  return (
    <Container>
      <FollowingUsersCard users={users} />
    </Container>
  );
}
