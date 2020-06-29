import React from 'react';
import CardFactory from './CardFactory';

export { default as CardFactory } from './CardFactory';

export default function CustomCard(props) {
  const { items } = props;

  const defaultCardRenderer = item => {
    const Card = CardFactory({ type: item.type });
    return (
      <Card
        name={item.label}
        price={item.amount / 100}
        photoUrl={item.photo_url}
        description={item.description}
        stripe_price_id={item.stripe_price_id}
        entity_id={item.entity_id}
      />
    );
  };

  return <div>{items && items.map(defaultCardRenderer)}</div>;
}
