import NotificationItem from './NotificationItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { goToScrollTo, ROUTES } from '../../../../actions/goTo';
import { TABS_ENUM } from '../../../../../../common/enums';
export default function ScoreSubmissionConflictNotification(props) {
  const { t } = useTranslation();
  const { metadata, onClick, ...otherProps } = props;

  const { eventId, gameId, eventName } = metadata;

  function handleClick() {
    if (onClick) {
      onClick();
    }

    goToScrollTo(
      ROUTES.entity,
      { id: eventId },
      { tab: TABS_ENUM.EDIT_SCHEDULE },
      gameId,
    );
  }

  const description = t(
    'score_submission_conflict_notif_description',
    { eventName },
  );

  return (
    <NotificationItem
      {...otherProps}
      description={description}
      initials={eventName[0]}
      onClick={handleClick}
    />
  );
}
