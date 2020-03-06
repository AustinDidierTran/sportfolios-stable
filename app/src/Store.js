import React, { useReducer } from 'react';
import history from './stores/history';

export const Store = React.createContext();

const initialState = { authToken: localStorage.getItem('authToken') };

export const ACTION_ENUM = {
  LOGIN: 'login',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_ENUM.LOGIN: {
      localStorage.setItem('authToken', action.payload);
      history.push('/userSettings')
      return { ...state, authToken: action.payload };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <Store.Provider value={value}>{props.children}</Store.Provider>
  );
}
