import React from 'react';
import ShoppingCartOutlined from '@material-ui/icons/ShoppingCartOutlined';

export default function CustomPopover(props) {
  return (
    <ShoppingCartOutlined {...props}>
      {props.children}
    </ShoppingCartOutlined>
  );
}
