import api from '../../actions/api';
import { uploadPicture } from '../../actions/aws';
import { ACTION_ENUM } from '../../Store';

const createProduct = async params => {
  const {
    data: { id: product_id },
  } = await api('/api/stripe/createProduct', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return product_id;
};

const createPrice = async params => {
  const {
    data: { id: price_id },
  } = await api('/api/stripe/createPrice', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return price_id;
};

const createItem = async params => {
  const { name, description, amount, photo_url, entity_id } = params;
  const productParams = {
    stripe_product: {
      name: name,
      description: description,
      active: true,
    },
    entity_id: entity_id,
  };

  const product = await createProduct(productParams);

  const priceParams = {
    stripe_price: {
      product: product,
      currency: 'cad',
      unit_amount: (+amount * 100).toString(),
      active: true,
    },
    entity_id: entity_id,
    photo_url: photo_url,
  };

  const price = await createPrice(priceParams);
  /* eslint-disable-next-line */
  console.log(`${product} ${price}`);
};

const onImgUpload = async (id, img, dispatch) => {
  const photoUrl = await uploadPicture(id, img);

  if (photoUrl) {
    dispatch({
      type: ACTION_ENUM.UPDATE_STORE_ITEM_PICTURE,
      payload: photoUrl,
    });
    return { status: 200, photoUrl: photoUrl };
  }
  return { status: 404, photoUrl: photoUrl };
};

export { createProduct, createPrice, createItem, onImgUpload };
