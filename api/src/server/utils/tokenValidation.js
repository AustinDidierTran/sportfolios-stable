import jsonwebtoken from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import { CLIENT_ID, REGION, USER_POOL_ID } from '../../../../conf.js';
import axios from 'axios';
const url = 'https://cognito-idp.' + REGION + '.amazonaws.com/' + USER_POOL_ID + '/.well-known/jwks.json';
const jsonWebKeys = await axios.get(url).catch(function (error) {
    console.log(error.response.data);
    return;
});


export function validateToken(token) {
    const header = decodeTokenHeader(token);
    const jsonWebKey = getJsonWebKeyWithKID(header.kid);
    const decodedToken = verifyJsonWebTokenSignature(token, jsonWebKey)
    if (decodedToken.exp > Math.round(Date.now() / 1000)) {
        if (decodedToken.aud === CLIENT_ID && decodedToken.iss === ('https://cognito-idp.' + REGION + '.amazonaws.com/' + USER_POOL_ID)) {
            return decodedToken;
        }
    }
    return null;
}

function decodeTokenHeader(token) {
    const [headerEncoded] = token.split('.');
    const buff = Buffer.from(headerEncoded, 'base64');
    const text = buff.toString('ascii');
    return JSON.parse(text);
}

function getJsonWebKeyWithKID(kid) {
    for (let jwk of jsonWebKeys.data.keys) {
        if (jwk.kid === kid) {
            return jwk;
        }
    }
    return null
}

function verifyJsonWebTokenSignature(token, jsonWebKey) {
    const pem = jwkToPem(jsonWebKey);
    const decodedToken = jsonwebtoken.verify(token, pem, { algorithms: ['RS256'] });
    return decodedToken;
}
