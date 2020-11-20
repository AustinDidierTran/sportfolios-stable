import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Collapse,
} from '@material-ui/core';
import React, { useContext } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NOTIFICATION_MEDIA,
  SEVERITY_ENUM,
} from '../../../../../../common/enums';
import { Icon } from '../../../Custom';
import { Typography } from '../../../MUI';
import { Store, ACTION_ENUM } from '../../../../Store';

export default function NotificationSettingsItem(props) {
  const { t } = useTranslation();
  const {
    name,
    email,
    chatbot,
    chatbotDisabled,
    icon,
    onChange,
    description,
    notificationType,
  } = props;
  const [open, setOpen] = useState(false);
  const emailString = email ? t('email') : '';
  const chatbotString = chatbot ? t('Chatbot') : '';
  const handleClick = () => {
    setOpen(!open);
  };
  const { dispatch } = useContext(Store);

  function onChatbotClick() {
    if (chatbotDisabled) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you_need_to_connect_your_messenger_account'),
        severity: SEVERITY_ENUM.INFO,
        duration: 4000,
      });
    }
  }

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <Icon icon={icon} />
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={
            [emailString, chatbotString].filter(Boolean).join(', ') ||
            t('notifications_disabled')
          }
        />
        <Icon icon={open ? 'ExpandLess' : 'ExpandMore'} />
      </ListItem>
      <Collapse in={open} timeaout="auto" unmountOnExit>
        <Typography
          variant="body2"
          align="left"
          style={{ paddingLeft: '20px' }}
        >
          {description}
        </Typography>
        <List component="div" disablePadding>
          <ListItem dense style={{ paddingLeft: 30 }}>
            <ListItemIcon>
              <Icon icon="Mail" />
            </ListItemIcon>
            <ListItemText primary={t('email')} />
            <Switch
              checked={email}
              color="primary"
              onChange={e =>
                onChange({
                  type: notificationType,
                  media: NOTIFICATION_MEDIA.EMAIL,
                  enabled: e.target.checked,
                })
              }
            />
          </ListItem>
          <ListItem
            dense
            style={{ paddingLeft: 30 }}
            onClick={onChatbotClick}
          >
            <ListItemIcon>
              <Icon icon="Chat" />
            </ListItemIcon>
            <ListItemText primary={t('chatbot')} />

            <Switch
              disabled={chatbotDisabled}
              checked={chatbot}
              color="primary"
              onChange={e =>
                onChange({
                  type: notificationType,
                  media: NOTIFICATION_MEDIA.CHATBOT,
                  enabled: e.target.checked,
                })
              }
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
