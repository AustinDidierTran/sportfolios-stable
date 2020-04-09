import React, { useReducer, useEffect } from 'react';
import { goTo, ROUTES } from './actions/goTo';

import { API_BASE_URL } from '../../conf';
import i18n from './i18n';

export const Store = React.createContext();

const localAuthToken = localStorage.getItem('authToken');
const localUserInfo = localStorage.getItem('userInfo');

const initialState = {
  authToken: localAuthToken,
  userInfo: localUserInfo && JSON.parse(localUserInfo),
};

export const ACTION_ENUM = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  UPDATE_USER_INFO: 'update_user_info',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_ENUM.LOGIN: {
      localStorage.setItem('authToken', action.payload);
      return { ...state, authToken: action.payload };
    }
    case ACTION_ENUM.LOGOUT: {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      goTo(ROUTES.login);
      return { ...state, authToken: null };
    }
    case ACTION_ENUM.UPDATE_USER_INFO: {
      localStorage.setItem(
        'userInfo',
        JSON.stringify(action.payload),
      );
      return { ...state, userInfo: action.payload };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    fetch(
      `${API_BASE_URL}/api/user/userInfo?authToken=${authToken}`,
      {
        headers: {
          Authorization: authToken,
        },
      },
    )
      .then(res => res.json())
      .then(({ data }) => {
        dispatch({
          type: ACTION_ENUM.UPDATE_USER_INFO,
          payload: data,
        });

        if (data.language) {
          i18n.changeLanguage(data.language);
        }
      });
  }, []);

  return (
    <Store.Provider value={value}>{props.children}</Store.Provider>
  );
}
