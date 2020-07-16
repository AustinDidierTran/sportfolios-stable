import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { useLocation } from 'react-router-dom';

import { GLOBAL_ENUM, VIEW_ENUM } from '../../../../../common/enums';
import { goTo, ROUTES } from '../../../actions/goTo';

import { Icon } from '..';
import { useMemo } from 'react';

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'absolute',
    bottom: '80px',
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 2,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const classes = useStyles();
  const location = useLocation();

  const actions = useMemo(() => {
    const path = location.pathname.split('/')[1] || '';
    switch (path) {
      case VIEW_ENUM.CART:
        setHidden(true);
        return [
          {
            icon: 'PeopleIcon',
            name: 'CART',
            onClick: () => {
              goTo(ROUTES.create, null, { type: GLOBAL_ENUM.TEAM });
              setOpen(false);
            },
          },
        ];
      case VIEW_ENUM.MENU:
        setHidden(true);
        return [
          {
            icon: 'Business',
            name: 'MENU',
            onClick: () => {
              goTo(ROUTES.create, null, { type: GLOBAL_ENUM.EVENT });
              setOpen(false);
            },
          },
        ];
        break;

      case VIEW_ENUM.HOME:
        setHidden(false);
        return [
          {
            icon: 'Event',
            name: 'Event',
            onClick: () => {
              goTo(ROUTES.create, null, { type: GLOBAL_ENUM.EVENT });
              setOpen(false);
            },
          },
          {
            icon: 'Business',
            name: 'Organization',
            onClick: () => {
              goTo(ROUTES.create, null, {
                type: GLOBAL_ENUM.ORGANIZATION,
              });
              setOpen(false);
            },
          },
          {
            icon: 'PeopleIcon',
            name: 'Team',
            onClick: () => {
              goTo(ROUTES.create, null, { type: GLOBAL_ENUM.TEAM });
              setOpen(false);
            },
          },
        ];

      case VIEW_ENUM.ORGANIZATION_LIST:
        setHidden(true);
        return [];
      default:
        setHidden(true);
        return [];
    }
  }, [location]);

  return (
    <div className={classes.root}>
      <Backdrop open={open} className={classes.backdrop} />
      <SpeedDial
        ariaLabel="SpeedDial"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={<Icon icon={action.icon} />}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
