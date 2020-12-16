import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';
import styles from './RankingItem.module.css';
import Divider from '@material-ui/core/Divider';

export default function RankingItem(props) {
  const { index, name } = props;

  if (index % 2 === 0) {
    return (
      <>
        <ListItem
          style={{
            width: '100%',
            padding: '0px',
            backGroundColor: 'grey',
          }}
        >
          <div className={styles.main} style={{ width: '100%' }}>
            <ListItemText
              className={styles.position}
              secondary={index + 1}
            />
            <ListItemText className={styles.name} primary={name} />
          </div>
        </ListItem>
        <Divider />
      </>
    );
  }
  return (
    <>
      <ListItem
        style={{
          width: '100%',
          padding: '0px',
          backGroundColor: 'primary',
        }}
      >
        <div className={styles.main} style={{ width: '100%' }}>
          <ListItemText
            className={styles.position}
            secondary={index + 1}
          />
          <ListItemText className={styles.name} primary={name} />
        </div>
      </ListItem>
      <Divider />
    </>
  );
}
