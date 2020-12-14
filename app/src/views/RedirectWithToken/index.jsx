import React, { useContext, useEffect } from 'react';
import { STATUS_ENUM } from '../../../../common/enums';
import { useQuery } from '../../hooks/queries';
import { Store, ACTION_ENUM } from '../../Store';
import { goTo, formatRoute } from '../../actions/goTo';
import { Container } from '@material-ui/core';
import api from '../../actions/api';

export default function RedirectWithToken() {
  const { token, url } = useQuery();
  const realUrl = decodeURI(url);
  const { dispatch } = useContext(Store);
  const login = async () => {
    const res = await api(
      formatRoute('/api/auth/loginWithToken', null, {
        token,
      }),
    );
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      dispatch({
        type: ACTION_ENUM.LOGIN,
        payload: {
          authToken: token,
          userInfo: res.data,
          route: realUrl,
        },
      });
    } else {
      goTo(realUrl);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <div>
      <Container>
        <p>Redirecting you...</p>
      </Container>
    </div>
  );
}
