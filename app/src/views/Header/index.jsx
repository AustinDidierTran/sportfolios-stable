import React, { useContext } from 'react';
import { Store } from '../../Store';

import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';

export default function PrimarySearchAppBar() {
  const { state: { authToken } } = useContext(Store);

  const isAuthenticated = Boolean(authToken);

  return (
    isAuthenticated ? <LoggedIn /> : <LoggedOut />
  );
}
