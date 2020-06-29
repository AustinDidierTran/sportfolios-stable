import React from 'react';
import CardFactory from './CardFactory';
import { List, ListSubheader } from '../../MUI';

export { default as CardFactory } from './CardFactory';

export default function CustomList(props) {
  const { title, items, ref, selectedIndex } = props;

  const defaultRowRenderer = (item, index) => {
    const Card = CardFactory({ type: item.type });
    return (
      <Card
        name={item.label}
        price={item.amount / 100}
        photoUrl={item.photo_url}
        description={item.description}
        stripe_price_id={item.stripe_price_id}
        entity_id={item.entity_id}
        selected={selectedIndex === index}
      />
    );
  };

  return (
    <List
      ref={ref}
      style={{ maxWidth: 'unset' }}
      aria-labelledby="nested-list-subheader"
      subheader={
        title ? (
          <ListSubheader component="div" id="nested-list-subheader">
            {title}
          </ListSubheader>
        ) : (
          <></>
        )
      }
      disablePadding
    >
      {items && items.map(defaultRowRenderer)}
    </List>
  );
}
