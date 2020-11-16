import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Collapse,
  Tooltip,
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_MEDIA } from '../../../../../../common/enums';
import { Icon } from '../../../Custom';
import { Typography } from '../../../MUI';

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
          <Tooltip
            enterTouchDelay={0}
            leaveTouchDelay={3000}
            placement="top"
            arrow
            title={
              chatbotDisabled
                ? t('you_need_to_connect_your_messenger_account')
                : ''
            }
          >
            <ListItem dense style={{ paddingLeft: 30 }}>
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
          </Tooltip>
        </List>
      </Collapse>
    </>
  );
}
