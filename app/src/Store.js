import React, { useReducer, useEffect } from 'react';
import { goTo, ROUTES } from './actions/goTo';

export const Store = React.createContext();

const initialState = { authToken: localStorage.getItem('authToken') };

export const ACTION_ENUM = {
  LOGIN: 'login',
  LOGOUT: 'logout'
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_ENUM.LOGIN: {
      localStorage.setItem('authToken', action.payload);
      return { ...state, authToken: action.payload };
    }
    case ACTION_ENUM.LOGOUT: {
      localStorage.removeItem('authToken');
      goTo(ROUTES.login);
      return { ...state, authToken: null }
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  useEffect(() => {

    fetch('')

  }, []);

  return (
    <Store.Provider value={value}>{props.children}</Store.Provider>
  );
}
