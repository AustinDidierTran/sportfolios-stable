import React, { useState, useEffect } from 'react';

import styles from './Shop.module.css';
import { formatRoute } from '../../actions/goTo';

import { Container } from '../../components/MUI';
import CustomCard from '../../components/Custom/Card';

import CreateItem from './CreateItem';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { CARD_TYPE_ENUM } from '../../../../common/enums';

export default function Shop(props) {
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const {
    basicInfos: { role },
  } = props;
  const isEditor = useEditor(role);

  const fetchShopItems = async () => {
    const { data = [] } = await api(
      formatRoute('/api/shop/getItems?', id),
    );
    setItems(
      data.map(d => ({
        ...d,
        type: CARD_TYPE_ENUM.SHOP,
      })),
    );
  };

  useEffect(() => {
    fetchShopItems();
  }, [id]);

  return (
    <Container className={styles.items}>
      <div>
        {isEditor ? <CreateItem fetchItems={fetchShopItems} /> : null}
        <CustomCard items={items} />
      </div>
    </Container>
  );
}
