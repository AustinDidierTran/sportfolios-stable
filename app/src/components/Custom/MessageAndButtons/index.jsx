import React, { useState } from 'react';

import { Paper, Button, IgContainer } from '..';
import { Typography } from '../../MUI';
import LoadingSpinner from '../LoadingSpinner';
import styles from './MessageAndButtons.module.css';
import { LOGO_ENUM } from '../../../../../common/enums';

export default function MessageAndButtons(props) {
  const { buttons, message } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = button => {
    setIsLoading(true);
    button.onClick();
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper style={{ textAlign: 'center', height: '100%' }}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO} />
        </div>
        <Typography style={{ paddingBottom: '16px' }}>
          {message}
        </Typography>
        <div className={styles.buttons}>
          {buttons.map((button, index) => (
            <Button
              size="small"
              variant="contained"
              endIcon={button.endIcon}
              style={{
                marginBottom: '16px',
              }}
              onClick={() => {
                handleClick(button);
              }}
              color={button.color}
              className={styles.button}
              key={index}
            >
              {button.name}
            </Button>
          ))}
        </div>
      </Paper>
    </IgContainer>
  );
}
