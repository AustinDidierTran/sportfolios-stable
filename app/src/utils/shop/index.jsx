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
  const {
    name,
    description,
    amount,
    photoUrl,
    entityId,
    sizes,
    type,
  } = params;
  const itemParams = {
    stripeProduct: {
      name: name,
      description: description,
      active: true,
      metadata: {
        seller_entity_id: entityId,
        sizes: JSON.stringify(sizes),
        type,
      },
    },
    stripePrice: {
      currency: 'cad',
      unit_amount: Math.floor(+amount * 100).toString(),
      active: true,
    },
    entityId,
    photoUrl,
  };

  const { data: item } = await api('/api/stripe/createItem', {
    method: 'POST',
    body: JSON.stringify(itemParams),
  });

  return item;
};

const editItem = async params => {
  const {
    name,
    description,
    amount,
    photoUrl,
    entityId,
    sizes,
    stripePriceIdToUpdate,
  } = params;
  const itemParams = {
    stripeProduct: {
      name: name,
      description: description,
      active: true,
      metadata: {
        seller_entity_id: entityId,
        sizes: JSON.stringify(sizes),
      },
    },
    stripePrice: {
      currency: 'cad',
      unit_amount: Math.floor(+amount * 100).toString(),
      active: true,
    },
    entityId,
    photoUrl,
    stripePriceIdToUpdate,
  };

  const { data: item } = await api('/api/stripe/editItem', {
    method: 'POST',
    body: JSON.stringify(itemParams),
  });

  return item;
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

export {
  createProduct,
  createPrice,
  createItem,
  onImgUpload,
  editItem,
};
