import React from 'react';
import { ShoppingCartOutlined } from '../../MUI';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function CartIcon(props) {
  const { id } = props;
  const onClick = () => {
    goTo(ROUTES.cart, { id });
  };

  return (
    <div onClick={onClick}>
      <ShoppingCartOutlined />
    </div>
  );
}
