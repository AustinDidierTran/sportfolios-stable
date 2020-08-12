import React, { useState, useEffect } from 'react';

import { formatRoute } from '../../../../actions/goTo';
import api from '../../../../actions/api';
import { Card } from '../../../../components/Custom';
import {
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../../../common/enums';
import { useTranslation } from 'react-i18next';

export default function Merchandise() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  const fetchShopItems = async () => {
    const { data = [] } = await api(
      formatRoute('/api/shop/getAllItems', null, {
        type: GLOBAL_ENUM.ORGANIZATION,
      }),
    );
    setItems(data);
  };

  useEffect(() => {
    fetchShopItems();
  }, []);

  const update = () => {
    fetchShopItems();
  };

  const button = {
    name: t('learn_more'),
  };

  return (
    <div>
      {items.map(item => {
        return (
          <Card
            items={{ ...item, setItems, update, button }}
            type={CARD_TYPE_ENUM.SHOP}
          />
        );
      })}
    </div>
  );
}
