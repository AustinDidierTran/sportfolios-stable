import NotificationItem from './NotificationItem';
import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  TABS_ENUM,
} from '../../../../../../common/enums';
import { Button } from '../../../Custom';
import api from '../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../Store';

export default function ConfirmOrDeclineScoreNotification(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { metadata, onClick, ...otherProps } = props;
  const {
    eventId,
    gameId,
    eventName,
    submittedBy,
    myRosterId,
    myPlayerId,
    submitted,
    suggestionId: scoreId,
  } = metadata;
  const scoreObj = JSON.parse(metadata.score);
  const scoreString = formatScore();
  const description = t(
    'confirm_or_decline_score_notif_description',
    {
      eventName,
      teamName: submittedBy,
      score: scoreString,
    },
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

  async function acceptScore(e) {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
    const res = await api('/api/entity/acceptScore', {
      method: 'POST',
      body: JSON.stringify({
        submitted_by_roster: myRosterId,
        id: scoreId,
        submitted_by_person: myPlayerId,
      }),
    });
    if (!res || res.status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('score_submitted'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    }
  }

  function formatScore() {
    return (
      Object.entries(scoreObj).reduce((acc, curr) => {
        const [name, score] = curr;
        return `${acc}${name}: ${score} `;
      }, '\n') + '\n'
    );
  }

  useEffect(() => {
    formatScore();
  }, []);

  const buttons = [
    <Button
      key={'button1' + props.id}
      color="primary"
      variant="contained"
      style={{ marginRight: '10px' }}
      onClick={acceptScore}
      disabled={submitted}
    >
      {submitted ? t('confirmed') : t('confirm')}
    </Button>,
    <Button
      key={'button2' + props.id}
      style={{ marginRight: '10px' }}
      textColor="grey"
      variant="text"
      onClick={handleClick}
    >
      {t('see_more')}
    </Button>,
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
