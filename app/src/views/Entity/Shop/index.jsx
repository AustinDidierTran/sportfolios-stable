import React, { useContext, useState, useEffect } from 'react';

import styles from './Shop.module.css';

import { Container } from '../../../components/MUI';
import Item from './Item';
import CreateItem from './CreateItem';
import { Store } from '../../../Store';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';

export default function Shop() {
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const {
    state: {
      userInfo: { id: user_id },
    },
  } = useContext(Store);

  const isSelf = id === user_id;
  //const isSelf = true;

  const fetchShopItems = async () => {
    const res = await api(`/api/shop/getItems?id=${id}`);
    const itemsdb = res.data;
    setItems(itemsdb);
  };

  useEffect(() => {
    fetchShopItems();
  }, [id]);

  return (
    <Container className={styles.items}>
      <div>
        {isSelf ? <CreateItem /> : null}
        {items.map(item => (
          <Item
            name={item.name}
            price={item.price}
            photoUrl={item.photoUrl}
            description={item.description}
          />
        ))}
      </div>
    </Container>
  );
}
