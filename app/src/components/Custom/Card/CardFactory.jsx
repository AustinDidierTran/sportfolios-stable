import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import Shop from './ShopItem';
import Cart from './CartItem';
import Invoice from './InvoiceItem';
import Default from './DefaultCard';
import AddPaymentOption from './AddPaymentOption';
import DeleteEntity from './DeleteEntity';
import EventPaymentOption from './EventPaymentOption';
import EventSettings from './EventSettings';

const CardMap = {
  [CARD_TYPE_ENUM.SHOP]: Shop,
  [CARD_TYPE_ENUM.CART]: Cart,
  [CARD_TYPE_ENUM.INVOICE]: Invoice,
  [CARD_TYPE_ENUM.ADD_PAYMENT_OPTION]: AddPaymentOption,
  [CARD_TYPE_ENUM.DELETE_ENTITY]: DeleteEntity,
  [CARD_TYPE_ENUM.EVENT_PAYMENT_OPTION]: EventPaymentOption,
  [CARD_TYPE_ENUM.EVENT_SETTINGS]: EventSettings,
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
