import React, { useState, useEffect } from 'react';
import styles from './MyRosterCard.module.css';
import { Paper, Icon, Avatar } from '../../../components/Custom';

import Players from './Players';
import { Typography } from '../../../components/MUI';
import Tag from '../Tag';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { ENTITIES_ROLE_ENUM } from '../../../../../common/enums';

const getEntity = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity', null, { id: eventId }),
  );
  return data;
};

export default function MyRosterCard(props) {
  const { roster } = props;
  const { position, name, players } = roster;
  const { id: eventId } = useParams();
  const { role, registrationStatus, teamId } = roster;

  const [expanded, setExpanded] = useState(true);

  const [event, setEvent] = useState({});
  const [team, setTeam] = useState({});

  const onExpand = () => {
    setExpanded(!expanded);
  };

  const getData = async () => {
    const event = await getEntity(eventId);
    setEvent(event);
    getTeam();
  };

  const getTeam = async () => {
    const team = await getEntity(teamId);
    setTeam(team);
  };

  useEffect(() => {
    getData();
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
              <Tag type={registrationStatus} />
            </div>
            <div className={styles.expand} onClick={onExpand}>
              <Icon
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

  return null;
}
