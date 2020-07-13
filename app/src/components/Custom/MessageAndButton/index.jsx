import React from 'react';

import styles from './MessageAndButton.module.css';
import { Paper, Button } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

export default function MessageAndButton(props) {
  const { button, onClick, endIcon, message, title } = props;

  return (
    <Paper title={title} style={{ textAlign: 'center' }}>
      <Typography style={{ margin: '8px' }}>{message}</Typography>
      <Button
        classname={styles.button}
        size="small"
        variant="contained"
        endIcon={endIcon}
        style={{
          margin: '8px',
        }}
        onClick={onClick}
      >
        {button}
      </Button>
    </Paper>
  );
}
