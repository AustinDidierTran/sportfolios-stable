import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import Shop from './ShopItem';
import Cart from './CartItem';
import Invoice from './InvoiceItem';
import Default from './DefaultCard';

const CardMap = {
  [CARD_TYPE_ENUM.SHOP]: Shop,
  [CARD_TYPE_ENUM.CART]: Cart,
  [CARD_TYPE_ENUM.INVOICE]: Invoice,
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
