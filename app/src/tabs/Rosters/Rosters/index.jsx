import React from 'react';
import styles from './Rosters.module.css';
import { Typography } from '../../../components/MUI';
import RosterCard from '../RosterCard';

export default function Rosters(props) {
  const { rosters } = props;

  return (
    <div>
      <Typography>RANKING</Typography>
      <div className={styles.contain}>
        {rosters.map((roster, index) => {
          return <RosterCard roster={roster} position={index + 1} />;
        })}
      </div>
    </div>
  );
}
