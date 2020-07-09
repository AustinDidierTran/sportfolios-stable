import React, { useReducer, useEffect } from 'react';
import { goTo, ROUTES } from './actions/goTo';

import { API_BASE_URL } from '../../conf';
import i18n from './i18n';
import api from './actions/api';

export const Store = React.createContext();

const localAuthToken = localStorage.getItem('authToken');
const localUserInfo = localStorage.getItem('userInfo');

const handleLocalAuthToken = token => {
  if (token === 'null') {
    return;
  }
  if (token === 'undefined') {
    return;
  }

  return token;
};

export const SCREENSIZE_ENUM = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

export const BREAKPOINTS = [
  { breakpoint: SCREENSIZE_ENUM.xl, value: 1920 },
  { breakpoint: SCREENSIZE_ENUM.lg, value: 1280 },
  { breakpoint: SCREENSIZE_ENUM.md, value: 960 },
  { breakpoint: SCREENSIZE_ENUM.sm, value: 600 },
  { breakpoint: SCREENSIZE_ENUM.xs, value: 0 },
].sort((a, b) => b.value - a.value);

const initialState = {
  authToken: handleLocalAuthToken(localAuthToken),
  screenSize: SCREENSIZE_ENUM.xs,
  cart: [],
  userInfo:
    (localUserInfo &&
      localUserInfo !== 'undefined' &&
      localUserInfo !== 'null' &&
      JSON.parse(localUserInfo)) ||
    {},
};

export const ACTION_ENUM = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  UPDATE_PROFILE_PICTURE: 'update_profile_picture',
  UPDATE_STORE_ITEM_PICTURE: 'update_store_item_picture',
  UPDATE_CART: 'update_cart',
  UPDATE_ORGANIZATION_PROFILE_PICTURE:
    'update_organization_profile_picture',
  UPDATE_USER_INFO: 'update_user_info',
  WINDOW_RESIZE: 'window_resize',
};

export const ENTITIES_ROLE_ENUM = {
  ADMIN: 1,
  EDITOR: 2,
  VIEWER: 3,
};

export const MEMBERSHIP_TYPE_ENUM = {
  ELITE: 1,
  COMPETITIVE: 2,
  RECREATIONAL: 3,
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
      return { ...state, authToken: null, userInfo: {} };
    }
    case ACTION_ENUM.UPDATE_PROFILE_PICTURE: {
      const newUserInfo = {
        ...state.userInfo,
        photoUrl: action.payload,
      };
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      return { ...state, userInfo: newUserInfo };
    }
    case ACTION_ENUM.UPDATE_ORGANIZATION_PROFILE_PICTURE: {
      const newOrganizationInfo = {
        ...state.organization,
        photoUrl: action.payload,
      };
      localStorage.setItem(
        'organization',
        JSON.stringify(newOrganizationInfo),
      );
      return { ...state, organization: newOrganizationInfo };
    }
    case ACTION_ENUM.UPDATE_USER_INFO: {
      localStorage.setItem(
        'userInfo',
        JSON.stringify(action.payload),
      );
      return { ...state, userInfo: action.payload };
    }
    case ACTION_ENUM.WINDOW_RESIZE: {
      const found = BREAKPOINTS.find(
        ({ value }) => value < action.payload,
      ) || { breakpoint: SCREENSIZE_ENUM.xs, value: 0 };

      return { ...state, screenSize: found.breakpoint };
    }
    case ACTION_ENUM.UPDATE_CART: {
      return { ...state, cart: action.payload };
    }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  const handleResize = () => {
    dispatch({
      type: ACTION_ENUM.WINDOW_RESIZE,
      payload: window.innerWidth,
    });
  };

  const init = async () => {
    const authToken = handleLocalAuthToken(
      localStorage.getItem('authToken'),
    );

    if (!authToken) {
      dispatch({
        type: ACTION_ENUM.LOGOUT,
      });
    } else {
      const res = await fetch(`${API_BASE_URL}/api/user/userInfo`, {
        headers: {
          Authorization: authToken,
        },
      });

      const { data } = await res.json();

      if (!data) {
        dispatch({
          type: ACTION_ENUM.LOGOUT,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.UPDATE_USER_INFO,
          payload: data,
        });

        if (data.language) {
          i18n.changeLanguage(data.language);
        }
      }
    }

    const res2 = await api('/api/shop/getCartItems');
    if (res2 && res2.data) {
      dispatch({
        type: ACTION_ENUM.UPDATE_CART,
        payload: res2.data,
      });
    }
  };

  useEffect(() => {
    init();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Store.Provider value={value}>{props.children}</Store.Provider>
  );
}
