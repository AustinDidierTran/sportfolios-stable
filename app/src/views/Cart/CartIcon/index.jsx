import React, { useContext } from 'react';
import { IconButton } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import { Store } from '../../../Store';
import { Badge } from '../../../components/MUI';

export default function CartIcon() {
  const {
    state: { cart },
  } = useContext(Store);

  return (
    <Badge badgeContent={cart.length} color="error">
      <IconButton
        color="inherit"
        icon="ShoppingCartOutlined"
        onClick={() => goTo(ROUTES.cart)}
      />
    </Badge>
  );
}
