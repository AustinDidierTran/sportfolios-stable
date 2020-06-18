import React from 'react';
import { Button } from '../../../../components/MUI';
import api from '../../../../actions/api';
import { useParams } from 'react-router-dom';

export default function CreateItem() {
  const { id } = useParams();
  const createProduct = async params => {
    const res = await api('/api/stripe/createProduct', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    const product_id = res.data.id;
    return product_id;
  };

  const createPrice = async params => {
    const res = await api('/api/stripe/createPrice', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    const price_id = res.data.id;
    return price_id;
  };

  const createItem = async () => {
    const productParams = {
      stripe_product: {
        name: 'frisbee123',
        description: '200g',
        active: true,
      },
      entity_id: id,
    };
    const product = await createProduct(productParams);
    const priceParams = {
      stripe_price: {
        product: product,
        currency: 'cad',
        unit_amount: '3000',
        active: true,
      },
      entity_id: id,
    };
    const price = await createPrice(priceParams);
    /* eslint-disable-next-line */
    console.log(`${product} ${price}`);
  };
  return <Button onClick={createItem}>Add new Product</Button>;
}
