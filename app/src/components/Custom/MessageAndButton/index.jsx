import React, { useState } from 'react';

import {
  Paper,
  Button,
  IgContainer,
} from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import LoadingSpinner from '../LoadingSpinner';
import styles from './MessageAndButton.module.css';
import { LOGO_ENUM } from '../../../../../common/enums';

export default function MessageAndButton(props) {
  const { button, onClick, endIcon, message, withoutButton } = props;

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
    <IgContainer>
      <Paper style={{ textAlign: 'center', height: '100%' }}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO} />
        </div>
        <Typography style={{ paddingBottom: '16px' }}>
          {message}
        </Typography>
        {withoutButton ? (
          <></>
        ) : (
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
        )}
      </Paper>
    </IgContainer>
  );
}
