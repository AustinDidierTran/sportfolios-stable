import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Paper, IgContainer, Icon } from '../../../components/Custom';
import { formatPageTitle } from '../../../utils/stringFormats';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabsGenerator from '../../../tabs';
import { goTo, ROUTES } from '../../../actions/goTo';
import { TABS_ENUM } from '../../../../../common/enums';

export default function Person(props) {
  const { basicInfos } = props;
  const { id } = useParams();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const states = TabsGenerator({
    list: [TABS_ENUM.ABOUT, TABS_ENUM.EDIT_PERSON_INFOS],
    role: basicInfos.role,
  });

  const [eventState, setEventState] = useState(TABS_ENUM.ABOUT);

  const OpenTab = useMemo(
    () => states.find(s => s.value == eventState).component,
    [eventState, states],
  );

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
      <div>
        <OpenTab {...props} />
      </div>
    </IgContainer>
  );
}
