import React from 'react';

import RosterCard from '../RosterCard';
import { Typography } from '../../../components/MUI';

export default function MyRoster(props) {
  const { roster, position } = props;
  return (
    <div>
      <Typography>MY ROSTER</Typography>
      <RosterCard roster={roster} position={position} />
    </div>
  );
}
