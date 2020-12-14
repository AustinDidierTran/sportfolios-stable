import React, { useReducer, useEffect } from 'react';
import { goTo, ROUTES } from './actions/goTo';

import { API_BASE_URL } from '../../conf';
import i18n from './i18n';
import api from './actions/api';
import { errors, ERROR_ENUM } from '../../common/errors';
import { io } from 'socket.io-client';
import { HEADER_FLYOUT_TYPE_ENUM } from '../../common/enums';
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
  cart: {
    items: [],
  },
  flyoutType: HEADER_FLYOUT_TYPE_ENUM.CLOSED,
  userInfo:
    (localUserInfo &&
      localUserInfo !== 'undefined' &&
      localUserInfo !== 'null' &&
      JSON.parse(localUserInfo)) ||
    {},
  activeGaPageviews: [],
  activeGaEvents: [],
  socket: io(API_BASE_URL),
};

export const ACTION_ENUM = {
  CLEAR_USER_INFO: 'clear_user_info',
  HEADER_FLYOUT: 'header_flyout',
  LOGIN: 'login',
  LOGOUT: 'logout',
  SNACK_BAR: 'snack_bar',
  UPDATE_PROFILE_PICTURE: 'update_profile_picture',
  UPDATE_STORE_ITEM_PICTURE: 'update_store_item_picture',
  UPDATE_CART: 'update_cart',
  UPDATE_ORGANIZATION_PROFILE_PICTURE:
    'update_organization_profile_picture',
  UPDATE_USER_INFO: 'update_user_info',
  WINDOW_RESIZE: 'window_resize',
  SET_GA_PAGEVIEWS: 'set_ga_pageviews',
  SET_GA_EVENTS: 'set_ga_events',
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
      if (action.payload.authToken) {
        localStorage.setItem('authToken', action.payload.authToken);
      } else {
        localStorage.setItem('authToken', action.payload);
      }
      if (action.payload.userInfo) {
        localStorage.setItem(
          'userInfo',
          JSON.stringify(action.payload.userInfo),
        );
      }
      if (action.payload.route) {
        goTo(
          action.payload.route,
          action.payload.params,
          action.payload.queryParams,
        );
      }
      return {
        ...state,
        authToken: action.payload.authToken || action.payload,
        userInfo: action.payload.userInfo || state.userInfo,
      };
    }
    case ACTION_ENUM.LOGOUT: {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      action.payload
        ? goTo(
            action.payload.route,
            action.payload.params,
            action.payload.queryParams,
          )
        : goTo(ROUTES.login);
      return {
        ...state,
        authToken: null,
        userInfo: {},
      };
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
    case ACTION_ENUM.CLEAR_USER_INFO: {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      return {
        ...state,
        authToken: null,
        userInfo: {},
      };
    }
    case ACTION_ENUM.SNACK_BAR: {
      return {
        ...state,
        message: action.message,
        severity: action.severity,
        duration: action.duration,
        vertical: action.vertical,
        horizontal: action.horizontal,
        time: Date.now(),
      };
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
    case ACTION_ENUM.SET_GA_PAGEVIEWS: {
      localStorage.setItem(
        'activeGaPageviews',
        JSON.stringify(action.payload),
      );
      return { ...state, activeGaEvents: action.payload };
    }
    case ACTION_ENUM.SET_GA_EVENTS: {
      localStorage.setItem(
        'activeGaEvents',
        JSON.stringify(action.payload),
      );
      return { ...state, activeGaPageviews: action.payload };
    }
    case ACTION_ENUM.HEADER_FLYOUT: {
      if (state.flyoutType === action.flyoutType) {
        return {
          ...state,
          flyoutType: HEADER_FLYOUT_TYPE_ENUM.CLOSED,
        };
      }
      return { ...state, flyoutType: action.flyoutType };
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

    if (authToken) {
      const res = await fetch(`${API_BASE_URL}/api/user/userInfo`, {
        headers: {
          Authorization: authToken,
        },
      });

      if (res.status === errors[ERROR_ENUM.TOKEN_EXPIRED].code) {
        dispatch({
          type: ACTION_ENUM.CLEAR_USER_INFO,
        });
        return;
      }

      const { data } = await res.json();

      if (data) {
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

    const res3 = await api('/api/ga/activePageviews');
    if (res3 && res3.data) {
      dispatch({
        type: ACTION_ENUM.SET_GA_PAGEVIEWS,
        payload: res3.data,
      });
    }

    const res4 = await api('/api/ga/activeEvents');
    if (res4 && res4.data) {
      dispatch({
        type: ACTION_ENUM.SET_GA_EVENTS,
        payload: res4.data,
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
