import React from 'react';
import CardFactory from './CardFactory';

export { default as CardFactory } from './CardFactory';

export default function CustomCard(props) {
  const { items, type } = props;
  const Card = CardFactory({ type });
  return <Card {...items} />;
}
