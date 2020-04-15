import api from '../api';
import axios from 'axios';

// 100 mb
const MAX_IMG_SIZE = 1024 * 1024 * 100;

const getSignature = async (userId, imgType) => {
  return api(
    `/api/profile/s3Signature/${userId}?fileType=${imgType}`,
  );
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

const changeProfileURLinUserInfo = async (userId, url) => {
  await api(`/api/profile/photoUrl/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      photoUrl: url,
    }),
  });
};

export async function uploadProfilePicture(userId, img) {
  if (!img) {
    throw 'Please select an image';
  }

  if (!userId) {
    throw 'Please send the user id with the request';
  }

  if (img.size > MAX_IMG_SIZE) {
    throw 'Image is too big';
  }

  const { data } = await getSignature(userId, img.type);

  await uploadToS3(img, data.signedRequest);

  await changeProfileURLinUserInfo(userId, data.url);

  return data.url;
}
