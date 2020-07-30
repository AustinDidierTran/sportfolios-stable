import React, { useState, useEffect } from 'react';
import styles from './MyRosterCard.module.css';
import { Paper, Icon, Avatar } from '../../../components/Custom';

import Players from './Players';
import { Typography } from '../../../components/MUI';
import Tag from '../Tag';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import {
  ENTITIES_ROLE_ENUM,
  REGISTRATION_STATUS_ENUM,
} from '../../../../../common/enums';

const getEvent = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity', null, { id: eventId }),
  );
  return data;
};

export default function MyRosterCard(props) {
  const { roster } = props;
  const { position = 0, name = 'Name', players = [] } = roster;
  const { id: eventId } = useParams();

  const [expanded, setExpanded] = useState(true);
  const [role, setRole] = useState(ENTITIES_ROLE_ENUM.VIEWER);
  const [event, setEvent] = useState({});
  const [team, setTeam] = useState({});

  const onExpand = () => {
    setExpanded(!expanded);
  };

  const onNameClick = () => {
    //TODO: get entityId of the team from rosterId
    //goTo(formatRoute(ROUTES.entity, {id: entityId}));
    console.log('name CLICK');
  };

  const getData = async () => {
    const event = await getEvent(eventId);
    setEvent(event);
    //setRole(event.role);
  };

  const getRole = () => {
    //TODO: Api call to know if you are part of the roster (EventAdmin, RosterAdmin, RosterMember, Viewer)
    setRole(ENTITIES_ROLE_ENUM.ADMIN);
  };

  const getTeam = () => {
    //TODO: Api call to get team info (avatar and teamId)
    setTeam({ photoUrl: '', initials: 'AL' });
  };

  useEffect(() => {
    getData();
    getRole();
    getTeam();
  }, []);

  if (role == ENTITIES_ROLE_ENUM.ADMIN) {
    return (
      <Paper className={styles.paper}>
        <div
          className={styles.card}
          style={{ backgroundColor: '#18B393', color: '#fff' }}
          onClick={onExpand}
        >
          <div className={styles.default}>
            <div className={styles.position}>{position}</div>
            <div className={styles.title}>
              <Avatar
                className={styles.avatar}
                photoUrl={team.photoUrl}
                initials={team.initials}
                size="sm"
              />
              <div className={styles.name}>
                <Typography>{name.toUpperCase()}</Typography>
              </div>
            </div>
            <div className={styles.pod}>
              <Tag type={REGISTRATION_STATUS_ENUM.PENDING} />
            </div>
            <div className={styles.expand} onClick={onExpand}>
              <Icon
                icon={
                  expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'
                }
              />
            </div>
            <div className={styles.expanded} hidden={!expanded}>
              <Players players={players} isAdmin />
            </div>
          </div>
        </div>
      </Paper>
    );
  }

  return null;
}
