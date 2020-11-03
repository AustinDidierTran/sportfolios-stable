import React, { useState, useEffect } from 'react';

import { Paper, IgContainer, Icon } from '../../../components/Custom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import styles from './Team.module.css';
import { useParams } from 'react-router-dom';

import { goTo, ROUTES } from '../../../actions/goTo';
import TabsGenerator from '../../../tabs';
import { formatPageTitle } from '../../../utils/stringFormats';
import { TABS_ENUM } from '../../../../../common/enums';

export default function Team(props) {
  const { basicInfos } = props;
  const { id } = useParams();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const [eventState, setEventState] = useState(TABS_ENUM.ABOUT);

  const states = TabsGenerator({
    list: [TABS_ENUM.ABOUT],
    role: basicInfos.role,
  });

  const OpenTab = states.find(s => s.value == eventState).component;

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <IgContainer className={styles.container}>
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
