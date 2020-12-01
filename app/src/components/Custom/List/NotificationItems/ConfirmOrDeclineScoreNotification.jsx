import NotificationItem from './NotificationItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { TABS_ENUM } from '../../../../../../common/enums';
import { Button } from '@material-ui/core';

export default function ConfirmOrDeclineScoreNotification(props) {
  const { t } = useTranslation();
  const { metadata, onClick, ...otherProps } = props;
  const { eventId, gameId, eventName } = metadata;
  const description = t(
    'confirm_or_decline_score_notif_description',
    { eventName },
  );

  function handleClick() {
    if (onClick) {
      onClick();
    }
    goTo(
      ROUTES.entity,
      { id: eventId },
      { tab: TABS_ENUM.SCHEDULE, game: gameId },
    );
  }

  const buttons = [
    <Button color="primary">{t('accept')}</Button>,
    <Button color="disabled">{t('submit_an_other_score')}</Button>,
  ];

  return (
    <NotificationItem
      {...otherProps}
      description={description}
      initials={eventName[0]}
      onClick={handleClick}
      buttons={buttons}
    />
  );
}
