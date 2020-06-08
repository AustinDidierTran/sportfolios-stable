import api from '../api';
import axios from 'axios';

// 100 mb
const MAX_IMG_SIZE = 1024 * 1024 * 100;

const getSignature = async imgType => {
  return api(`/api/profile/s3Signature?fileType=${imgType}`);
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

const changeProfileURLinUserInfo = async url => {
  await api(`/api/profile/photoUrl`, {
    method: 'PUT',
    body: JSON.stringify({
      photoUrl: url,
    }),
  });
};

const changeOrganizationURL = async (id, url) => {
  await api(`/api/organization`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      organization: { photo_url: url },
    }),
  });
};

export async function uploadOrganizationPicture(id, img) {
  if (!img) {
    throw 'Please select an image';
  }

  if (img.size > MAX_IMG_SIZE) {
    throw 'Image is too big';
  }

  const { data } = await getSignature(img.type);

  await uploadToS3(img, data.signedRequest);

  await changeOrganizationURL(id, data.url);

  return data.url;
}

export async function uploadProfilePicture(img) {
  if (!img) {
    throw 'Please select an image';
  }

  if (img.size > MAX_IMG_SIZE) {
    throw 'Image is too big';
  }

  const { data } = await getSignature(img.type);

  await uploadToS3(img, data.signedRequest);

  await changeProfileURLinUserInfo(data.url);

  return data.url;
}
