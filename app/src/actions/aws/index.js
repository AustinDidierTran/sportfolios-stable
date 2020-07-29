import api from '../api';
import axios from 'axios';

// 100 mb
const MAX_IMG_SIZE = 1024 * 1024 * 100;

const getSignature = async (id, imgType) => {
  return api(`/api/entity/s3Signature?fileType=${imgType}`);
};

const uploadToS3 = async (file, signedRequest) => {
  const options = {
    headers: {
      'Access-Control-Allow-Origin': 's3.amazonaws.com',
      'Access-Control-Allow-Methods':
        'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Origin, Content-Type, X-Auth-Token',
      'Content-Type': file.type,
    },
  };

  await axios.put(signedRequest, file, options);
};

const changeEntityURL = async (id, url) => {
  await api(`/api/entity`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      photoUrl: url,
    }),
  });
};

export async function uploadEntityPicture(id, img) {
  if (!img) {
    throw 'Please select an image';
  }

  if (img.size > MAX_IMG_SIZE) {
    throw 'Image is too big';
  }

  const { data } = await getSignature(id, img.type);

  await uploadToS3(img, data.signedRequest);

  await changeEntityURL(id, data.url);

  return data.url;
}

export async function uploadPicture(id, img) {
  if (!img) {
    throw 'Please select an image';
  }

  if (img.size > MAX_IMG_SIZE) {
    throw 'Image is too big';
  }

  const { data } = await getSignature(id, img.type);

  await uploadToS3(img, data.signedRequest);

  return data.url;
}
