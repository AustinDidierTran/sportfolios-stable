import React, { useState } from 'react';

import styles from './Shop.module.css';

import { Container } from '../../../components/MUI';
import Item from './Item';

export default function Shop(props) {
  const items = [
    {
      name: 'Disque Blanc',
      price: '12$',
      photoUrl:
        'https://lh3.googleusercontent.com/proxy/9b1TvdEqFGtNdTy20WdOCzbqqBYbxMl-Kuk_eu9RWMVIopGxv0Vsvje8sZ3hS1DVBlSTkHoKqrjlSSBKbndswKW_iuXu-QRz_xyjikumvaUnTlDV3A',
      description: 'Disque officiel 175g de couleur blanche',
    },
    {
      name: 'Disque Blanc',
      price: '12$',
      photoUrl:
        'https://lh3.googleusercontent.com/proxy/9b1TvdEqFGtNdTy20WdOCzbqqBYbxMl-Kuk_eu9RWMVIopGxv0Vsvje8sZ3hS1DVBlSTkHoKqrjlSSBKbndswKW_iuXu-QRz_xyjikumvaUnTlDV3A',
      description: 'Disque officiel 175g de couleur blanche',
    },
    {
      name: 'Disque Blanc',
      price: '12$',
      photoUrl:
        'https://lh3.googleusercontent.com/proxy/9b1TvdEqFGtNdTy20WdOCzbqqBYbxMl-Kuk_eu9RWMVIopGxv0Vsvje8sZ3hS1DVBlSTkHoKqrjlSSBKbndswKW_iuXu-QRz_xyjikumvaUnTlDV3A',
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
