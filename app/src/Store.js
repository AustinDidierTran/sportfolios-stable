import React, { useReducer, useEffect } from 'react';
import { goTo, ROUTES } from './actions/goTo';

import { API_BASE_URL } from '../../conf';
import i18n from './i18n';

export const Store = React.createContext();

const localAuthToken = localStorage.getItem('authToken');
const localUserInfo = localStorage.getItem('userInfo');

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
  authToken: localAuthToken,
  screenSize: SCREENSIZE_ENUM.xs,
  userInfo:
    localUserInfo &&
    localUserInfo !== 'undefined' &&
    JSON.parse(localUserInfo),
};

export const ACTION_ENUM = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  UPDATE_PROFILE_PICTURE: 'update_profile_picture',
  UPDATE_ORGANIZATION_PROFILE_PICTURE:
    'update_organization_profile_picture',
  UPDATE_USER_INFO: 'update_user_info',
  WINDOW_RESIZE: 'window_resize',
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
    case ACTION_ENUM.UPDATE_PROFILE_PICTURE: {
      const newUserInfo = {
        ...state.userInfo,
        photo_url: action.payload,
      };
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      return { ...state, userInfo: newUserInfo };
    }
    case ACTION_ENUM.UPDATE_ORGANIZATION_PROFILE_PICTURE: {
      const newOrganizationInfo = {
        ...state.organization,
        photo_url: action.payload,
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

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      dispatch({
        type: ACTION_ENUM.LOGOUT,
      });
    }

    fetch(`${API_BASE_URL}/api/user/userInfo`, {
      headers: {
        Authorization: authToken,
      },
    })
      .then(res => res.json())
      .then(({ data }) => {
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
      });
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
