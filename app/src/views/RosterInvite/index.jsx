import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ROUTES_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums/index.js';
import api from '../../actions/api/index.js';
import { formatRoute, goTo } from '../../actions/goTo';
import { IgContainer, LoadingSpinner } from '../../components/Custom';
import Rosters from '../../tabs/Rosters/Rosters';

export default function RosterInvite() {
  const [rosters, setRosters] = useState();
  const { token } = useParams();

  const fetchRoster = async () => {
    const res = await api(
      formatRoute('/api/entity/rosterFromInviteToken', null, {
        token,
      }),
    );
    console.log({ token });
    console.log({ res });
    if (res && res.status == STATUS_ENUM.SUCCESS_STRING) {
      setRosters([{ players: res.data, name: 'test' }]);
    } else {
      goTo(ROUTES_ENUM.entityNotFound);
    }
  };
  useEffect(() => {
    fetchRoster();
  }, []);
  if (!rosters) {
    return <LoadingSpinner />;
  }
  return (
    <IgContainer>
      <Rosters
        rosters={rosters}
        onAdd={() => {}}
        onDelete={() => {}}
        onRoleUpdate={() => {}}
        update={() => {}}
      />
    </IgContainer>
  );
}
