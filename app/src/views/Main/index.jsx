import React, { useEffect, useContext, useState } from 'react';

import styles from './Main.module.css';

import { Card, CardContent } from '../../components/MUI';
import { Container } from '../../components/Custom';

import { useAllMainInformations } from '../../actions/api/helpers';

import FollowingUsersCard from './FollowingUsersCard/index';

export default function Main() {
  const { users } = useAllMainInformations();

  return (
    <Container className={styles.container}>
      <FollowingUsersCard users={users} />
    </Container>
  );
}
