import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import Default from './DefaultCard';
import DeleteEntity from './DeleteEntity';
import EditableGame from './EditableGame';
import EventPost from './EventPost';
import EventSettings from './EventSettings';
import Game from './Game';
import Invoice from './InvoiceItem';
import Report from './Report';
import ScoreSuggestion from './ScoreSuggestion';
import Shop from './ShopItem';
import TwoTeamGame from './TwoTeamGame';
import TwoTeamGameEditable from './TwoTeamGameEditable';
import TwoTeamGameProfile from './TwoTeamGameProfile';

const CardMap = {
  [CARD_TYPE_ENUM.DELETE_ENTITY]: DeleteEntity,
  [CARD_TYPE_ENUM.EDITABLE_GAME]: EditableGame,
  [CARD_TYPE_ENUM.EVENT_SETTINGS]: EventSettings,
  [CARD_TYPE_ENUM.EVENT]: EventPost,
  [CARD_TYPE_ENUM.GAME]: Game,
  [CARD_TYPE_ENUM.INVOICE]: Invoice,
  [CARD_TYPE_ENUM.REPORT]: Report,
  [CARD_TYPE_ENUM.SCORE_SUGGESTION]: ScoreSuggestion,
  [CARD_TYPE_ENUM.SHOP]: Shop,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME_EDITABLE]: TwoTeamGameEditable,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME]: TwoTeamGame,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME_PROFILE]: TwoTeamGameProfile,
};

export default function CardFactory(props) {
  const { type } = props;

  const Card = CardMap[type];

  if (!Card) {
    /* eslint-disable-next-line */
    console.error(`${type} is not supported in CardFactory`);
    return Default;
  }

  return Card;
}
