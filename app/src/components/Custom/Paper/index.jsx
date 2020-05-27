import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Store, SCREENSIZE_ENUM } from '../../../Store';

export default function CustomPaper(props) {
  const {
    state: { screenSize },
  } = useContext(Store);

  const [elevation, setElevation] = useState(0);

  useEffect(() => {
    if (screenSize === SCREENSIZE_ENUM.xs) {
      setElevation(0);
    } else {
      setElevation(2);
    }
  }, [screenSize]);

  return <Paper elevation={elevation} {...props} />;
}
