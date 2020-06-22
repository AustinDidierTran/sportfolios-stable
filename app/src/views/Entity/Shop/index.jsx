import React, { useState, useEffect, useMemo } from 'react';

import styles from './Shop.module.css';

import { Container } from '../../../components/MUI';
import Item from './Item';
import CreateItem from './CreateItem';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { ENTITIES_ROLE_ENUM } from '../../../../../common/enums';

export default function Shop(props) {
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const { basicInfos } = props;
  const role = basicInfos.role;

  const isEditor = useMemo(
    () =>
      [ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(
        role,
      ),
    [role],
  );

  const fetchShopItems = async () => {
    const { data = [] } = await api(`/api/shop/getItems?id=${id}`);
    setItems(data);
  };

  useEffect(() => {
    fetchShopItems();
  }, [id]);

  return (
    <Container className={styles.items}>
      <div>
        {isEditor ? <CreateItem fetchItems={fetchShopItems} /> : null}
        {items.map(item => (
          <Item
            name={item.label}
            price={item.amount / 100}
            photoUrl={item.photo_url}
            description={item.description}
            stripe_price_id={item.stripe_price_id}
            entity_id={item.entity_id}
          />
        ))}
      </div>
    </Container>
  );
}
