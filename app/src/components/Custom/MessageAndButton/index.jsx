import React from 'react';

import { Paper, Button } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

export default function MessageAndButton(props) {
  const { button, onClick, endIcon, message, title } = props;

  return (
    <Paper title={title} style={{ textAlign: 'center' }}>
      <Typography style={{ marginTop: '16px', padding: '16px' }}>
        {message}
      </Typography>
      <Button
        size="small"
        variant="contained"
        endIcon={endIcon}
        style={{
          marginBottom: '16px',
        }}
        onClick={onClick}
      >
        {button}
      </Button>
    </Paper>
  );
}
