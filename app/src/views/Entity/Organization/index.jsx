import React, { useState, useEffect } from 'react';

import { Paper, IgContainer, Icon } from '../../../components/Custom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';

import { goTo, ROUTES } from '../../../actions/goTo';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM } from '../../../../../common/enums';

export default function Organization(props) {
  const { basicInfos } = props;
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.EVENTS,
  );

  const tabsList =
    basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN ||
    basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR
      ? [
          TABS_ENUM.ABOUT,
          TABS_ENUM.EVENTS,
          TABS_ENUM.SHOP,
          TABS_ENUM.SETTINGS,
        ]
      : [TABS_ENUM.ABOUT, TABS_ENUM.EVENTS, TABS_ENUM.SHOP];

  const states = TabsGenerator({
    list: tabsList,
    role: basicInfos.role,
  });

  const OpenTab = tabsList.includes(eventState)
    ? states.find(s => s.value == eventState).component
    : states.find(s => s.value === TABS_ENUM.EVENTS).component;

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <IgContainer>
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
      <div style={{ marginBottom: '128px' }}>
        <OpenTab basicInfos={basicInfos} />
      </div>
    </IgContainer>
  );
}
