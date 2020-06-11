import React from 'react';

import styles from './Shop.module.css';

import { Container } from '../../../components/MUI';
import Item from './Item';

export default function Shop() {
  const items = [
    {
      name: 'Disque Blanc',
      price: '12$',
      photoUrl:
        'https://sportfolios-images.s3.amazonaws.com/development/images/profile/20200527-zk1u9-9dba1457-42ae-4c37-be4e-b05f7acfd11d',
      description: 'Disque officiel 175g de couleur blanche',
    },
    {
      name: 'Disque Blanc',
      price: '12$',
      photoUrl:
        'https://sportfolios-images.s3.amazonaws.com/development/images/profile/20200527-zk1u9-9dba1457-42ae-4c37-be4e-b05f7acfd11d',
      description: 'Disque officiel 175g de couleur blanche',
    },
    {
      name: 'Disque Blanc',
      price: '12$',
      photoUrl:
        'https://sportfolios-images.s3.amazonaws.com/development/images/profile/20200527-zk1u9-9dba1457-42ae-4c37-be4e-b05f7acfd11d',
      description: 'Disque officiel 175g de couleur blanche',
    },
  ];

  return (
    <Container className={styles.items}>
      {items.map(item => (
        <Item
          name={item.name}
          price={item.price}
          photoUrl={item.photoUrl}
          description={item.description}
        />
      ))}
    </Container>
  );
}
