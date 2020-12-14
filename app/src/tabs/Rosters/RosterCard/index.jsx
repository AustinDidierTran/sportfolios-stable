import React, { useMemo } from 'react';
import styles from './RosterCard.module.css';
import { Paper, Icon, Avatar } from '../../../components/Custom';

import Players from './Players';
import { Typography } from '../../../components/MUI';
import Tag from '../Tag';
import { ROSTER_ROLE_ENUM } from '../../../../../common/enums';

const isEven = n => {
  return n % 2 == 0;
};

export default function RosterCard(props) {
  const {
    isEventAdmin,
    roster,
    expandedIndex,
    setExpandedIndex,
    onDelete,
    whiteList,
    onAdd,
    onRoleUpdate,
    index,
    update,
    editableRoster: editableRosterProp, editableRole: editableRoleProp
  } = props;
  const isTeamEditor = useMemo(()=> {
    role == ROSTER_ROLE_ENUM.CAPTAIN ||
    role == ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ||
    role == ROSTER_ROLE_ENUM.COACH;
  }, [role]);
    const editableRoster = useMemo(() => editableRoster || isTeamEditor, [editableRoster, isTeamEditor]);
    const editableRole = useMemo(() => editableRole || isTeamEditor, [editableRole, isTeamEditor]);
  const {
    position,
    name,
    players,
    rosterId,
    role,
    registrationStatus,
  } = roster;
  const expanded = useMemo(() => expandedIndex === index, [
    expandedIndex,
    index,
  ]);

  const onExpand = () => {
    setExpandedIndex(oldIndex => (oldIndex === index ? 0 : index));
  };

  const greenBackground =
    isEventAdmin || role != ROSTER_ROLE_ENUM.VIEWER;
    const style = useMemo(() => {
      if (greenBackground && isEven(index)) {
          return { backgroundColor: '#19bf9d', color: '#fff' };
      }
      if (greenBackground && !isEven(index)) {
          return { backgroundColor: '#18B393', color: '#fff' };
      }
      if ((!greenBackground && isEven(index)) {
          return { backgroundColor: '#f2f2f2' };
      }
  }, [greenBackground, index]);

  return (
    <Paper className={styles.paper}>
      <div className={styles.card} style={style} onClick={onExpand}>
        <div className={styles.default}>
          <div className={styles.position}>
          {position || '-'}
          </div>
          <div className={styles.title}>
            <div className={styles.name}>
              <Typography>{name.toUpperCase()}</Typography>
            </div>
            <Avatar
              className={styles.avatar}
              photoUrl={roster.photoUrl}
              size="sm"
            />
          </div>
          <div className={styles.pod}>
            <Tag type={registrationStatus} />
          </div>
          <div className={styles.expand}>
            <Icon
              icon={
                expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'
              }
            />
          </div>
        </div>
      </div>
      <div className={styles.expanded} hidden={!expanded}>
        <Players
          isEventAdmin={isEventAdmin}
          editableRoster={editableRoster}
          editableRole={editableRole}
          whiteList={whiteList}
          players={players}
          update={update}
          rosterId={rosterId}
          onDelete={onDelete}
          onAdd={onAdd}
          onRoleUpdate={onRoleUpdate}
        />
      </div>
    </Paper>
  );
}
