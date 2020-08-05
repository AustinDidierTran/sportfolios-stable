import React, { useEffect, useMemo, useState } from 'react';

import { Tab, Tabs } from '../../../components/MUI';
import { Paper, IgContainer } from '../../../components/Custom';

import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';

import { goTo, ROUTES } from '../../../actions/goTo';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';
import { formatPageTitle } from '../../../utils/stringFormats';
import { Helmet } from 'react-helmet';

export default function Event(props) {
  const { basicInfos } = props;
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos.name]);

  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.EVENT_INFO,
  );

  const states = TabsGenerator({
    list: [
      TABS_ENUM.EVENT_INFO,
      TABS_ENUM.ROSTERS,
      TABS_ENUM.SETTINGS,
    ],

    role: basicInfos.role,
  });

  const OpenTab = useMemo(
    () => states.find(s => s.value == eventState).component,
    [eventState, states],
  );

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  if (states.length == 1) {
    return (
      <IgContainer>
        <OpenTab basicInfos={basicInfos} />
      </IgContainer>
    );
  }

  const ogDescription = useMemo(
    () =>
      basicInfos.description
        ? decodeURIComponent(basicInfos.description)
        : '',
    [basicInfos.description],
  );

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
              icon={s.icon}
            />
          ))}
        </Tabs>
      </Paper>
      <OpenTab basicInfos={basicInfos} />
    </IgContainer>
  );
}
