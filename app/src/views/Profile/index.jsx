import React, { useContext, useState, useEffect } from 'react';
import { Container } from '../../components/MUI';
import { Store } from '../../Store';
import styles from './Profile.module.css';
import BasicInfos from './BasicInfos/index';
import AthleteHistory from './AthleteHistory/index';
import Organizations from './Organizations/index';
import Teams from './Teams/index';
import FundingOther from './FundingOther';
import FundingSelf from './FundingSelf';
import api from '../../actions/api';

export default function Profile(props) {
  const [basicInfos, setBasicInfos] = useState({});

  const updateBasicInfos = async () => {
    const res = await api(
      `/api/profile/userInfo/:id?8317ff33-3b04-49a1-afd3-420202cddf73`,
    );

    setBasicInfos(res);
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

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <BasicInfos isSelf basicInfos={basicInfos} />
        {isSelf ? <FundingSelf /> : <FundingOther />}
        <Organizations
          isSelf
          organizations={[
            'Association utlimate Sherbrooke',
            'Association Utlimate quebec',
          ]}
        />
        <Teams isSelf teams={['Barons', 'Montcalm']} />
        <AthleteHistory
          isSelf
          achievements={['1er au monde', '3e au quebec']}
        />
      </Container>
    </div>
  );
}
