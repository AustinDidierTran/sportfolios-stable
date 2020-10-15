import React, { useEffect, useMemo, useState } from 'react';

import { Paper, IgContainer, Icon } from '../../../components/Custom';

import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { goTo, ROUTES } from '../../../actions/goTo';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';
import { formatPageTitle } from '../../../utils/stringFormats';
import { Helmet } from 'react-helmet';
import { ENTITIES_ROLE_ENUM } from '../../../../../common/enums';
import { AddGaEvent } from '../../../components/Custom/Analytics';

export default function Event(props) {
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
      TABS_ENUM.SWITCH_TO_ADMIN,
    ],
    role: basicInfos.role,
  });

  const adminState = TabsGenerator({
    list: [
      TABS_ENUM.EDIT_SCHEDULE,
      TABS_ENUM.EDIT_RANKINGS,
      TABS_ENUM.EDIT_ROSTERS,
      TABS_ENUM.SETTINGS,
      TABS_ENUM.SWITCH_TO_USER,
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
    if (
      s.value === TABS_ENUM.SWITCH_TO_USER ||
      s.value === TABS_ENUM.SWITCH_TO_ADMIN
    ) {
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
    } else {
      goTo(ROUTES.entity, { id }, { tab: s.value });
      setEventState(s.value);
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

  return (
    <IgContainer>
      <Helmet>
        <meta property="og:title" content={basicInfos.name} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={basicInfos.photoUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_CA" />
      </Helmet>
      <Paper>
        {window.innerWidth < 768 ? (
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
        ) : (
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
        )}
      </Paper>
      <OpenTab basicInfos={basicInfos} />
    </IgContainer>
  );
}
