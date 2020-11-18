import React from 'react';
import { Card } from '..';
import { Typography } from '../../MUI';
import {
  CARD_TYPE_ENUM,
  TABS_ENUM,
} from '../../../../../common/enums';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function MyGames(props) {
  const { t } = useTranslation();
  const { gamesInfos } = props;

  const onGameClick = eventId => {
    goTo(
      ROUTES.entity,
      { id: eventId },
      { tabs: TABS_ENUM.SCHEDULE },
    );
  };

  return (
    <div>
      <Typography
        variant="h6"
        color="textPrimary"
        style={{ marginBottom: 4 }}
      >
        {t('future_games')}
      </Typography>
      {gamesInfos.length ? (
        gamesInfos.map(game => (
          <Card
            key={game.id}
            items={{
              ...game,
              onClick: onGameClick,
            }}
            type={CARD_TYPE_ENUM.TWO_TEAM_GAME_PROFILE}
          />
        ))
      ) : (
        <Typography color="textSecondary">{t('no_games')}</Typography>
      )}
    </div>
  );
}
