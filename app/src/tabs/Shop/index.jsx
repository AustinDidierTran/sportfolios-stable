import React, { useState, useEffect } from 'react';

import styles from './Shop.module.css';
import { formatRoute, goTo, ROUTES } from '../../actions/goTo';

import { Container } from '../../components/MUI';
import { FeatureContainer, Button } from '../../components/Custom';
import CustomCard from '../../components/Custom/Card';
import { useEditor } from '../../hooks/roles';

import CreateItem from './CreateItem';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import { FEATURE_FLAGS } from '../../../../common/flags';
import { useTranslation } from 'react-i18next';

export default function Shop(props) {
  const { t } = useTranslation();
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

  const update = () => {
    fetchShopItems();
  };

  const goToSales = () => {
    goTo(ROUTES.sales, { id });
  };

  return (
    <Container className={styles.items} style={{ marginTop: '8px' }}>
      <FeatureContainer
        className={styles.feature}
        feature={FEATURE_FLAGS.SHOP}
        options={{ displayComingSoon: true }}
      >
        <div>
          {isEditor ? (
            <>
              <CreateItem fetchItems={fetchShopItems} />
              <br />
              <Button onClick={goToSales}>{t('see_sales')}</Button>
              <br />
              <br />
            </>
          ) : null}
          {items.map((item, index) => {
            return (
              <CustomCard
                items={{ ...item, setItems, isEditor, update }}
                type={CARD_TYPE_ENUM.SHOP}
                key={index}
              />
            );
          })}
        </div>
      </FeatureContainer>
    </Container>
  );
}
