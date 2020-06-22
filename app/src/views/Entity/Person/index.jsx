import React, { useContext, useMemo, useState } from 'react';
import { Tab, Tabs } from '../../../components/MUI';
import { Container, Paper } from '../../../components/Custom';
import { Store } from '../../../Store';
import styles from './Person.module.css';
import BasicInfos from './BasicInfos';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';
import { ENTITIES_ROLE_ENUM } from '../../../../../common/enums';

export default function Person(props) {
  const { basicInfos } = props;

  const [eventState, setEventState] = useState(TABS_ENUM.GENERAL);

  const {
    state: { userInfo },
  } = useContext(Store);

  const personId = userInfo && userInfo.id;

  const isSelf = basicInfos.id === personId;

  const states = TabsGenerator({
    list: [
      TABS_ENUM.GENERAL,
      TABS_ENUM.ABOUT,
      // TABS_ENUM.SHOP,
      TABS_ENUM.SETTINGS,
    ],
    role: isSelf ? ENTITIES_ROLE_ENUM.ADMIN : null,
  });

  const OpenTab = useMemo(
    () => states.find(s => s.value == eventState).component,
    [eventState, states],
  );

  return (
    <Container className={styles.container}>
      <Paper className={styles.card}>
        <Container className={styles.title}>
          <BasicInfos isSelf={isSelf} basicInfos={basicInfos} />
        </Container>
        <Tabs
          value={states.findIndex(s => s.value === eventState)}
          indicatorColor="primary"
          textColor="primary"
          className={styles.tabs}
          // centered
        >
          {states.map((s, index) => (
            <Tab
              key={index}
              onClick={() => setEventState(s.value)}
              label={s.label}
              icon={s.icon}
            />
          ))}
        </Tabs>
      </Paper>
      <OpenTab isSelf={isSelf} />
    </Container>
  );
}
