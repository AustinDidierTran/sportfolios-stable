import React, { useState, useEffect, useMemo } from 'react';

import { Paper, IgContainer, Icon } from '../../../components/Custom';

import {
  Tabs,
  Tab,
  Tooltip,
  Fab,
  makeStyles,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';
import Div100vh from 'react-div-100vh';
import { goTo, ROUTES } from '../../../actions/goTo';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  fabMobile: {
    position: 'absolute',
    bottom: theme.spacing(2) + 58,
    right: theme.spacing(2),
    zIndex: 100,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2) + (window.innerWidth - 700) / 2,
    zIndex: 100,
    color: 'white',
  },
}));

export default function Organization(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos } = props;
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.EVENTS,
  );

  const [isAdmin, setIsAdmin] = useState(false);

  const userState = TabsGenerator({
    list: [TABS_ENUM.EVENTS, TABS_ENUM.ABOUT],
    role: basicInfos.role,
  });

  const adminState = TabsGenerator({
    list: [TABS_ENUM.EDIT_EVENTS, TABS_ENUM.SETTINGS],
    role: basicInfos.role,
  });

  const [states, setStates] = useState(userState);

  const getStates = isAdmin => {
    if (isAdmin) {
      setStates(adminState);
    } else {
      setStates(userState);
    }
  };

  const OpenTab = useMemo(() => {
    if (states.map(s => s.value).includes(eventState)) {
      return states.find(s => s.value == eventState).component;
    } else {
      if (adminState.map(a => a.value).includes(eventState)) {
        if (
          basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN ||
          basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR
        ) {
          setIsAdmin(true);
          setStates(adminState);
          return;
        }
      }
      setIsAdmin(false);
      setStates(userState);
      setEventState(TABS_ENUM.EVENTS);
    }
  }, [eventState, states]);

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  const onSwitch = () => {
    const newState = !isAdmin;
    setIsAdmin(newState);
    getStates(newState);
    if (newState) {
      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.EDIT_EVENTS });
      setEventState(TABS_ENUM.EDIT_EVENTS);
    } else {
      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.EVENTS });
      setEventState(TABS_ENUM.EVENTS);
    }
  };

  const title = useMemo(() => {
    if (isAdmin) {
      return t('player_view');
    } else {
      return t('admin_view');
    }
  }, [isAdmin]);

  if (!states || states.length == 1) {
    return (
      <IgContainer>
        <OpenTab basicInfos={basicInfos} />
      </IgContainer>
    );
  }

  if (window.innerWidth < 768) {
    return (
      <Div100vh>
        <IgContainer>
          <Paper>
            <Tabs
              value={states.findIndex(s => s.value === eventState)}
              indicatorColor="primary"
              textColor="primary"
            >
              {states.map((s, index) => (
                <Tab
                  key={index}
                  onClick={() => onClick(s)}
                  icon={<Icon icon={s.icon} />}
                  style={{
                    minWidth: window.innerWidth / states.length,
                  }}
                />
              ))}
            </Tabs>
          </Paper>
          {basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN ||
          basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR ? (
            <Tooltip title={title}>
              <Fab
                color="primary"
                onClick={onSwitch}
                className={classes.fabMobile}
              >
                <Icon icon="Autorenew" />
              </Fab>
            </Tooltip>
          ) : (
            <></>
          )}
          <div style={{ marginBottom: '128px' }}>
            <OpenTab basicInfos={basicInfos} />
          </div>
        </IgContainer>
      </Div100vh>
    );
  }

  return (
    <Div100vh>
      <IgContainer>
        <Paper>
          <Tabs
            value={states.findIndex(s => s.value === eventState)}
            indicatorColor="primary"
            textColor="primary"
          >
            {states.map((s, index) => (
              <Tab
                key={index}
                onClick={() => onClick(s)}
                label={s.label}
                icon={<Icon icon={s.icon} />}
                style={{ minWidth: 700 / states.length }}
              />
            ))}
          </Tabs>
        </Paper>
        {basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN ||
        basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR ? (
          <Tooltip title={title}>
            <Fab
              color="primary"
              onClick={onSwitch}
              className={classes.fab}
            >
              <Icon icon="Autorenew" />
            </Fab>
          </Tooltip>
        ) : (
          <></>
        )}
        <div style={{ marginBottom: '128px' }}>
          <OpenTab basicInfos={basicInfos} />
        </div>
      </IgContainer>
    </Div100vh>
  );
}
