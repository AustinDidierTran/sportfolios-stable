import React, { useContext, useState, useEffect } from 'react';
import { Container } from '../../components/MUI';
import { Store } from '../../Store';
import styles from './Profile.module.css';
import BasicInfos from './BasicInfos';
import General from './General';
import api from '../../actions/api';

export const TABS_ENUM = {
  GENERAL: 'general',
  ABOUT: 'about',
  SHOP: 'shop',
};

export default function Profile(props) {
  const [basicInfos, setBasicInfos] = useState({});

  const updateBasicInfos = async () => {
    const { data } = await api(
      `/api/profile/userInfo/8317ff33-3b04-49a1-afd3-420202cddf73`,
    );

    setBasicInfos(data);
  };

  useEffect(() => {
    updateBasicInfos();
  }, []);

  const {
    state: { userInfo },
  } = useContext(Store);

  const user_id = userInfo && userInfo.user_id;

  const {
    match: {
      params: { id },
    },
  } = props;

  const isSelf = id === user_id;

  // const states = [
  //   {
  //     value: TABS_ENUM.GENERAL,
  //     component: NextEvents,
  //     label: t('general'),
  //   },
  //   {
  //     value: TABS_ENUM.SHOP,
  //     component: Shop,
  //     label: t('shop'),
  //   },
  //   {
  //     value: TABS_ENUM.ABOUT,
  //     component: About,
  //     label: t('about'),
  //   },
  // ];

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <BasicInfos isSelf={isSelf} basicInfos={basicInfos} />
        <General isSelf={isSelf} />
      </Container>
    </div>
  );
}
