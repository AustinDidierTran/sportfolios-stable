import React from 'react';

import DefaultCartItem from './DefaultCartItem';
import EventCartItem from './EventCartItem';

export default function Item(props) {
  const { stripePriceMetadata } = props;

  const { type } = stripePriceMetadata;

  if (+type === 4) {
    return <EventCartItem {...props} />;
  }

  return <DefaultCartItem {...props} />;
}
