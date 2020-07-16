import React, { useContext, useState, useEffect } from 'react';
import { Store } from '../../Store';

import LoggedIn from './LoggedIn';
import Default from './Default';
import LoggedOut from './LoggedOut';
import { useLocation } from 'react-router-dom';
import { Typography } from '../../components/MUI';
import { IconButton } from '../../components/Custom';
import { goTo, ROUTES } from '../../actions/goTo';
import api from '../../actions/api';
import { GLOBAL_ENUM } from '../../../../common/enums';

const getEntity = async entityId => {
  const { data } = await api(`/api/entity?id=${entityId}`);
  return data;
};

export default function Header() {
  const {
    state: { authToken, userInfo = {} },
  } = useContext(Store);
  const isAuthenticated = Boolean(authToken);
  const location = useLocation();
  const [path, setPath] = useState('');
  const [entity, setEntity] = useState({});

  const fetchData = async () => {
    const pth = location.pathname.split('/')[1] || '';

    if (['cart', 'menu', 'organizationList'].includes(pth)) {
      setPath(pth);
    } else {
      if (pth) {
        const ent = await getEntity(pth);
        setPath(ent.type);
        setEntity(ent);
      } else {
        setPath('');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  if (isAuthenticated) {
    switch (path) {
      case 'cart':
        return (
          <Default
            Item1={() => (
              <Typography style={{ fontSize: '24px' }}>
                {'Cart'}
              </Typography>
            )}
            Item4={() => (
              <IconButton
                color="inherit"
                icon="ShoppingCartOutlined"
                onClick={() =>
                  goTo(ROUTES.cart, {
                    id: userInfo.user_id,
                  })
                }
              />
            )}
          />
        );

      case 'menu':
        return (
          <Default
            Item1={() => (
              <Typography style={{ fontSize: '24px' }}>
                {'Menu'}
              </Typography>
            )}
            Item4={() => (
              <IconButton
                color="inherit"
                icon="ShoppingCartOutlined"
                onClick={() =>
                  goTo(ROUTES.cart, {
                    id: userInfo.user_id,
                  })
                }
              />
            )}
          />
        );

      case GLOBAL_ENUM.PERSON:
        return (
          <Default
            Item2={() => (
              <Typography style={{ fontSize: '16px' }}>
                {entity.name}
              </Typography>
            )}
            Item4={() => (
              <IconButton
                color="inherit"
                icon="ShoppingCartOutlined"
                onClick={() =>
                  goTo(ROUTES.cart, {
                    id: userInfo.user_id,
                  })
                }
              />
            )}
          />
        );

      case GLOBAL_ENUM.ORGANIZATION:
        return (
          <Default
            Item2={() => (
              <Typography style={{ fontSize: '16px' }}>
                {entity.name}
              </Typography>
            )}
            Item4={() => (
              <IconButton
                color="inherit"
                icon="ShoppingCartOutlined"
                onClick={() =>
                  goTo(ROUTES.cart, {
                    id: userInfo.user_id,
                  })
                }
              />
            )}
          />
        );

      case GLOBAL_ENUM.TEAM:
        return (
          <Default
            Item2={() => (
              <Typography style={{ fontSize: '16px' }}>
                {entity.name}
              </Typography>
            )}
            Item4={() => (
              <IconButton
                color="inherit"
                icon="ShoppingCartOutlined"
                onClick={() =>
                  goTo(ROUTES.cart, {
                    id: userInfo.user_id,
                  })
                }
              />
            )}
          />
        );

      case GLOBAL_ENUM.EVENT:
        return (
          <Default
            Item2={() => (
              <Typography style={{ fontSize: '16px' }}>
                {entity.name}
              </Typography>
            )}
            Item4={() => (
              <IconButton
                color="inherit"
                icon="ShoppingCartOutlined"
                onClick={() =>
                  goTo(ROUTES.cart, {
                    id: userInfo.user_id,
                  })
                }
              />
            )}
          />
        );

      default:
        return <LoggedIn />;
    }
  }
  return <LoggedOut />;
}
