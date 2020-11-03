import React, { useEffect, useMemo, useState } from 'react';

import { Paper, IgContainer, Icon } from '../../../components/Custom';

import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';

import {
  Tabs,
  Tab,
  Tooltip,
  Fab,
  makeStyles,
} from '@material-ui/core';
import { goTo, ROUTES } from '../../../actions/goTo';
import TabsGenerator from '../../../tabs';
import { formatPageTitle } from '../../../utils/stringFormats';
import { Helmet } from 'react-helmet';
import {
  ENTITIES_ROLE_ENUM,
  TABS_ENUM,
} from '../../../../../common/enums';
import { AddGaEvent } from '../../../components/Custom/Analytics';
import Div100vh from 'react-div-100vh';
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

export default function Event(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos } = props;
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
    AddGaEvent({
      category: 'Visit',
      action: 'User visited event',
      label: 'Event_page',
    });
  }, [basicInfos.name]);

  const [isAdmin, setIsAdmin] = useState(false);

  const userState = TabsGenerator({
    list: [
      TABS_ENUM.SCHEDULE,
      TABS_ENUM.RANKINGS,
      TABS_ENUM.ROSTERS,
      TABS_ENUM.EVENT_INFO,
    ],
    role: basicInfos.role,
  });

  const adminState = TabsGenerator({
    list: [
      TABS_ENUM.EDIT_SCHEDULE,
      TABS_ENUM.EDIT_RANKINGS,
      TABS_ENUM.EDIT_ROSTERS,
      TABS_ENUM.SETTINGS,
    ],
    role: basicInfos.role,
  });

  const [states, setStates] = useState(userState);

  const getEventState = () => {
    if (adminState.map(a => a.value).includes(query.tab)) {
      if (
        basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN ||
        basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR
      ) {
        return query.tab;
      } else {
        goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.SCHEDULE });
      }
    }
    return query.tab || TABS_ENUM.SCHEDULE;
  };

  const [eventState, setEventState] = useState(getEventState());

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
      setEventState(TABS_ENUM.SCHEDULE);
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
      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.EDIT_SCHEDULE });
      setEventState(TABS_ENUM.EDIT_SCHEDULE);
    } else {
      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.SCHEDULE });
      setEventState(TABS_ENUM.SCHEDULE);
    }
  };

  if (!states || states.length == 1) {
    return (
      <IgContainer>
        <OpenTab basicInfos={basicInfos} />
      </IgContainer>
    );
  }

  const ogDescription = useMemo(() => {
    if (basicInfos.quickDescription) {
      return decodeURIComponent(basicInfos.quickDescription);
    }
    if (basicInfos.description) {
      return decodeURIComponent(basicInfos.description);
    }
    return '';
  }, [basicInfos]);

  const title = useMemo(() => {
    if (isAdmin) {
      return t('player_view');
    } else {
      return t('admin_view');
    }
  }, [isAdmin]);

  if (window.innerWidth < 768) {
    return (
      <Div100vh>
        <IgContainer>
          <Helmet>
            <meta property="og:title" content={basicInfos.name} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:image" content={basicInfos.photoUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="fr_CA" />
          </Helmet>
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
        <Helmet>
          <meta property="og:title" content={basicInfos.name} />
          <meta property="og:description" content={ogDescription} />
          <meta property="og:image" content={basicInfos.photoUrl} />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="fr_CA" />
        </Helmet>
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
