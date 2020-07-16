import React, { useState, useEffect } from 'react';

import styles from './Shop.module.css';
import { formatRoute } from '../../actions/goTo';

import { Container } from '../../components/MUI';
import { FeatureContainer } from '../../components/Custom';
import CustomCard from '../../components/Custom/Card';
import { useEditor } from '../../hooks/roles';

import CreateItem from './CreateItem';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import { FEATURE_FLAGS } from '../../../../common/flags';

export default function Shop(props) {
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const {
    basicInfos: { role },
  } = props;
  const isEditor = useEditor(role);

  const fetchShopItems = async () => {
    const { data = [] } = await api(
      formatRoute('/api/shop/getItems', null, { id }),
    );
    setItems(data);
  };

  useEffect(() => {
    fetchShopItems();
  }, [id]);

  return (
    <Container className={styles.items}>
      <FeatureContainer
        className={styles.feature}
        feature={FEATURE_FLAGS.SHOP}
        options={{ displayComingSoon: true }}
      >
        <div>
          {isEditor ? (
            <CreateItem fetchItems={fetchShopItems} />
          ) : null}
          {items.map(item => {
            return (
              <CustomCard
                items={{ ...item, setItems }}
                type={CARD_TYPE_ENUM.SHOP}
              />
            );
          })}
        </div>
      </FeatureContainer>
    </Container>
  );
}
