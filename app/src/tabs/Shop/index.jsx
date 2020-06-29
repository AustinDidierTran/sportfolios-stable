import React, { useState, useEffect, useMemo } from 'react';

import styles from './Shop.module.css';

import { Container } from '../../components/MUI';
import CustomCard from '../../components/Custom/Card';

import CreateItem from './CreateItem';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';

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
    setItems(
      data.map(d => ({
        ...d,
        type: 1,
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
