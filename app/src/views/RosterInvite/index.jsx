import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ROUTES_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums/index.js';
import api from '../../actions/api/index.js';
import { formatRoute, goTo } from '../../actions/goTo';
import { IgContainer, LoadingSpinner } from '../../components/Custom';
import { Store } from '../../Store.js';
import RosterCard from '../../tabs/Rosters/RosterCard/index.jsx';

export default function RosterInvite() {
  const {
    state: { userInfo },
  } = useContext(Store);
  const [roster, setRoster] = useState();
  const { token } = useParams();
  const [expanded, setExpanded] = useState(true);

  const fetchRoster = async () => {
    const res = await api(
      formatRoute('/api/entity/rosterFromInviteToken', null, {
        token,
      }),
    );
    if (res.status == STATUS_ENUM.SUCCESS_STRING) {
      setRoster({ ...res.data });
    } else {
      goTo(ROUTES_ENUM.entityNotFound);
    }
  };
  useEffect(() => {
    fetchRoster();
  }, []);
  if (!roster) {
    return <LoadingSpinner />;
  }
  return (
    <IgContainer>
      <RosterCard
        roster={roster}
        update={fetchRoster}
        onExpand={() => setExpanded(!expanded)}
        expanded={expanded}
        whiteList={userInfo.persons.map(p => p.entity_id)}
        withMyPersonsQuickAdd
      />
    </IgContainer>
  );
}
