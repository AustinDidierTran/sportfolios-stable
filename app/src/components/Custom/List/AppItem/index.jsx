import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Button } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { APP_ENUM } from '../../../../../../common/enums';
import { ListItemSecondaryAction } from '@material-ui/core';
import styles from './AppItem.module.css';

const images = {
  [APP_ENUM.FACEBOOK]:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20201015-swk3f-03819b6b-b74e-4cb8-9a1a-299a9ee3b2fc',
  [APP_ENUM.MESSENGER]:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20201016-9hha3-03819b6b-b74e-4cb8-9a1a-299a9ee3b2fc',
};

const defaultImage =
  'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20201016-3gcer-03819b6b-b74e-4cb8-9a1a-299a9ee3b2fc';

export default function AppItem(props) {
  const { t } = useTranslation();
  const {
    onConnect,
    onDisconnect,
    app,
    description,
    isConnected,
    secondaryAction,
  } = props;
  const imageSrc = images[app] || defaultImage;
  const action = secondaryAction ? (
    secondaryAction
  ) : (
    <Button
      className={styles.button}
      onClick={isConnected ? onDisconnect : onConnect}
      variant="outlined"
      color={isConnected ? 'secondary' : 'primary'}
    >
      {isConnected ? t('disconnect') : t('connect')}
    </Button>
  );

  return (
    <ListItem className={styles.main}>
      <ListItemIcon>
        <img src={imageSrc} height="40px" />
      </ListItemIcon>
      <ListItemText
        className={styles.text}
        primary={app}
        secondary={description}
      />
      <ListItemSecondaryAction>
        <>{action}</>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
