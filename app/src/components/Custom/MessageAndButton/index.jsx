import React, { useState } from 'react';

import { Paper, Button } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import LoadingSpinner from '../LoadingSpinner';
import logo from '../../../img/bigLogo.png';
import styles from './MessageAndButton.module.css';

export default function MessageAndButton(props) {
  const { button, onClick, endIcon, message, title } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    onClick();
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Paper title={title} style={{ textAlign: 'center' }}>
      <div className={styles.logo}>
        <img className={styles.img} src={logo} />
      </div>
      <Typography style={{ paddingBottom: '16px' }}>
        {message}
      </Typography>
      <Button
        size="small"
        variant="contained"
        endIcon={endIcon}
        style={{
          marginBottom: '16px',
        }}
        onClick={handleClick}
      >
        {button}
      </Button>
    </Paper>
  );
}
