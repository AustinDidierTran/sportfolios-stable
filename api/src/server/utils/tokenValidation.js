import jsonwebtoken from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { CLIENT_ID, REGION, USER_POOL_ID } from '../../../../conf.js';
import axios from 'axios';
const url = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

const getWebKeys = async () => {
  const resp = await axios.get(url).catch(function(error) {
    // eslint-disable-next-line
    console.log(error);
    return;
  });
  return resp;
};

export const validateToken = async token => {
  const webKeys = await getWebKeys();
  const header = await decodeTokenHeader(token);
  const jsonWebKey = await getJsonWebKeyWithKID(header.kid, webKeys.data);
  const decodedToken = await verifyJsonWebTokenSignature(token, jsonWebKey);

  if (decodedToken.exp > Math.round(Date.now() / 1000)) {
    if (
      decodedToken.aud === CLIENT_ID &&
      decodedToken.iss ===
        `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
    ) {
      return decodedToken;
    }
  }
  return null;
};

function decodeTokenHeader(token) {
  const [headerEncoded] = token.split('.');
  const buff = Buffer.from(headerEncoded, 'base64');
  const text = buff.toString('ascii');
  return JSON.parse(text);
}

const getJsonWebKeyWithKID = (kid, webKeys) => {
  for (let jwk of webKeys.keys) {
    if (jwk.kid === kid) {
      return jwk;
    }
  }
  return null;
};

function verifyJsonWebTokenSignature(token, jsonWebKey) {
  const pem = jwkToPem(jsonWebKey);
  console.log(123, { token, pem });
  const decodedToken = jsonwebtoken.verify(token, pem, {
    algorithms: ['RS256'],
  });
  console.log(123, { decodedToken });
  return decodedToken;
}
