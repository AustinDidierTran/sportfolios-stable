import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ROUTES_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums/index.js';
import api from '../../actions/api/index.js';
import { formatRoute, goTo } from '../../actions/goTo/index.js';
import { LoadingSpinner } from '../../components/Custom/index.jsx';
import Rosters from '../../tabs/Rosters/Roster/index.jsx';

export default function RosterInvite() {
  const [rosters, setRosters] = useState();
  const { token } = useParams();

  const fetchRoster = async () => {
    const res = await api(
      formatRoute('/api/entity/getRosterFromToken', null, { token }),
    );
    if (res && res.status == STATUS_ENUM.SUCCESS_STRING) {
      setRosters(res.data);
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
    <Rosters
      rosters={rosters}
      onAdd={() => {}}
      onDelete={() => {}}
      onRoleUpdate={() => {}}
      update={() => {}}
    />
  );
}
