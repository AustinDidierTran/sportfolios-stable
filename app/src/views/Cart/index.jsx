import React, { useState } from 'react';

import TabsGenerator, { TABS_ENUM } from '../../tabs';
import { goTo, ROUTES } from '../../actions/goTo';
import { Tab, Tabs } from '../../components/MUI';
import { Paper } from '../../components/Custom';
import { useQuery } from '../../hooks/queries';

export default function Cart() {
  const query = useQuery();
  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.CART,
  );

  const tabsList = [TABS_ENUM.CART, TABS_ENUM.ORDERS];
  const states = TabsGenerator({ list: tabsList });

  const OpenTab = tabsList.includes(eventState)
    ? states.find(s => s.value == eventState).component
    : states.find(s => s.value === TABS_ENUM.CART).component;

  const onClick = s => {
    goTo(ROUTES.cart, null, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <>
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
      <OpenTab />
    </>
  );
}
