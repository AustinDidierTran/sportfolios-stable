import NotificationItem from './NotificationItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { TABS_ENUM } from '../../../../../../common/enums';

export default function RosterNotification(props) {
  const { t } = useTranslation();
  const { metadata, onClick, ...otherProps } = props;

  const { eventId, teamName } = metadata;

  const description = t('added_to_roster_notif_description', {
    teamName,
  });
  const title = t('added_to_roster_notif_title');

  function handleClick() {
    if (onClick) {
      onClick();
    }
    goTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.ROSTERS });
  }

  return (
    <NotificationItem
      {...otherProps}
      description={description}
      title={title}
      initials={teamName[0]}
      onClick={handleClick}
    />
  );
}
