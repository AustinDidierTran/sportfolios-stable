import React, { useEffect, useContext, useState } from 'react';

import styles from './Main.module.css';

import { Card, CardContent, Container } from '../../components/MUI';

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
