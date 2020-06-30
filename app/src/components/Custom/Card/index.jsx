import React from 'react';
import CardFactory from './CardFactory';

export { default as CardFactory } from './CardFactory';

export default function CustomCard(props) {
  const { items, setItems } = props;

  const defaultCardRenderer = item => {
    const Card = CardFactory({ type: item.type });
    return <Card {...item} setItems={setItems} />;
  };

  return <div>{items && items.map(defaultCardRenderer)}</div>;
}
