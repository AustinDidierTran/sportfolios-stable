import React, { useState } from 'react';

import TabsGenerator from '../../tabs';
import { goTo, ROUTES } from '../../actions/goTo';
import { Tab, Tabs } from '../../components/MUI';
import { IgContainer, Paper } from '../../components/Custom';
import { useQuery } from '../../hooks/queries';
import { TABS_ENUM } from '../../../../common/enums';

export default function Cart() {
  const query = useQuery();
  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.CART,
  );

  const tabsList = [TABS_ENUM.CART, TABS_ENUM.PURCHASES];
  const states = TabsGenerator({ list: tabsList });

  const OpenTab = tabsList.includes(eventState)
    ? states.find(s => s.value == eventState).component
    : states.find(s => s.value === TABS_ENUM.CART).component;

  const onClick = s => {
    goTo(ROUTES.cart, null, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <IgContainer>
      <Paper style={{ marginBottom: '8px' }}>
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
      <OpenTab />
    </IgContainer>
  );
}
