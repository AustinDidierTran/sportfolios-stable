import React, { useState, useEffect } from 'react';
import styles from './RosterCard.module.css';
import { Paper, Icon } from '../../../components/Custom';

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

function isEven(n) {
  return n % 2 == 0;
}

const getEvent = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity', null, { id: eventId }),
  );
  return data;
};

export default function RosterCard(props) {
  const {
    roster,
    initialExpanded,
    expandedPosition,
    setExpandedPosition,
  } = props;
  const { position = 0, name = 'name', players = [] } = roster;

  const { id: eventId } = useParams();
  const [expanded, setExpanded] = useState(initialExpanded);
  const [event, setEvent] = useState({});
  const [role, setRole] = useState(ENTITIES_ROLE_ENUM.VIEWER);

  const [status, setStatus] = useState(
    REGISTRATION_STATUS_ENUM.PENDING,
  );

  const onExpand = () => {
    setExpandedPosition(oldPosition =>
      oldPosition === position ? 0 : position,
    );
  };

  // const onNameClick = () => {
  //   //TODO: Redirect to team page.
  // };

  const getData = async () => {
    const event = await getEvent(eventId);
    setEvent(event);
  };

  const getRole = () => {
    //TODO: Api call to know if you are part of the roster (EventAdmin, RosterAdmin, RosterMember, Viewer)
    setRole(ENTITIES_ROLE_ENUM.ADMIN);
  };

  const getStatus = () => {
    //TODO: Api call to get status of team registration
    setStatus(REGISTRATION_STATUS_ENUM.ACCEPTED);
  };

  useEffect(() => {
    getData();
    getRole();
    getStatus();
  }, []);

  useEffect(() => {
    if (expandedPosition == position) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [expandedPosition]);

  if (role == ENTITIES_ROLE_ENUM.ADMIN) {
    return (
      <Paper className={styles.paper}>
        <div
          className={styles.card}
          style={
            isEven(position) ? { backgroundColor: '#f2f2f2' } : {}
          }
          key={position}
          onClick={onExpand}
        >
          <div className={styles.default}>
            <div className={styles.position}>{position}</div>
            <div className={styles.name}>
              <Typography>{name.toUpperCase()}</Typography>
            </div>
            <div className={styles.pod}>
              <Tag type={status} />
            </div>
            <div className={styles.expand} onClick={onExpand}>
              <Icon
                onClick={onExpand}
                icon={
                  expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'
                }
              />
            </div>
            <div className={styles.expanded} hidden={!expanded}>
              <Players players={players} role={role} />
            </div>
          </div>
        </div>
      </Paper>
    );
  }

  return (
    <Paper className={styles.paper}>
      <div
        className={styles.card}
        style={isEven(position) ? { backgroundColor: '#f2f2f2' } : {}}
        key={position}
        onClick={onExpand}
      >
        <div className={styles.default}>
          <div className={styles.position}>{position}</div>
          <div className={styles.name}>
            <Typography>{name.toUpperCase()}</Typography>
          </div>
          <div className={styles.expand} onClick={onExpand}>
            <Icon
              onClick={onExpand}
              icon={
                expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'
              }
            />
          </div>
          <div className={styles.expanded} hidden={!expanded}>
            <Players players={players} />
          </div>
        </div>
      </div>
    </Paper>
  );
}
