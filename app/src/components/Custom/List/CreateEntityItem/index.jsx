import React from 'react';
import { Icon } from '../..';
import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';

import styles from './CreateEntityItem.module.css';

export default function CreateEntityItem(props) {
  const { icon, title, description, onClick } = props;

  return (
    <ListItem button className={styles.main} onClick={onClick}>
      <ListItemIcon>
        <Icon icon={icon} />
      </ListItemIcon>
      <ListItemText
        className={styles.text}
        primary={title}
        secondary={description}
      />
    </ListItem>
  );
}
