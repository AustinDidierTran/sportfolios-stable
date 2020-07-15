import React from 'react';
import { goTo, ROUTES } from '../../../actions/goTo';
import { Icon, IconButton } from '..';

export default function CartIcon(props) {
  const { id } = props;

  return (
    <IconButton
      color="inherit"
      onClick={() => goTo(ROUTES.entity, { id })}
    >
      <Icon icon="ShoppingCartOutlined" />
    </IconButton>
  );
}
