import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Store, SCREENSIZE_ENUM } from '../../../Store';

import styles from './Paper.module.css';

export default function CustomPaper(props) {
  const { title, children, childrenProps, ...paperProps } = props;
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

  return (
    <Paper elevation={elevation} {...paperProps}>
      {title ? (
        <div className={styles.title}>
          <span>{title}</span>
        </div>
      ) : null}
      <div {...childrenProps}>{children}</div>
    </Paper>
  );
}
