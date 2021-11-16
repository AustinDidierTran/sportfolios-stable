import jsonwebtoken from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import { CLIENT_ID, REGION, USER_POOL_ID } from '../../../../conf.js';
// import axios from 'axios';
// const url = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
// const getWebKeys = async () => {
//     const resp = await axios.get(url).catch(function (error) {
//         console.log(error);
//         return;
//     })
//     return resp;
// };


const jsonWebKeys = { 'keys': [{ 'alg': 'RS256', 'e': 'AQAB', 'kid': '7TMzwyAbug91PvKZDDVhBrK5QyblV+7nGo0r2CaD89Y=', 'kty': 'RSA', 'n': '7gOQ5A8qSmzEMoOajWsgzHdfoq5AmSv-zEniM6Kbkt3BBE5BemBSDMtptnfFNVhdL5MrcU1tucQ7ROZMTvsH1Ds-WEQziDW1EnTSEzKurph9Bdpr-k8ipAtwEBAPGTgQJYRMz3gqc2AHdYjVmKhXCLZmvQgUxu5s8E54XWrwbKEBsv6fWjEnzUEn0RtH7qgVpzxRKzcXz8c4XpjfvgkNw6Ndm73zx8jy7JBQOw9Q4S5cQ2LYrPHnyUqpllOLQ-dBOY2Fa4IJZKUL_5shxtwjO63CsYdQlsieN2x9ljaNIJRVXY-j_KimFYxFfzIqj5VADbAMDsR7opGTwq5JgLt4ZQ', 'use': 'sig' }, { 'alg': 'RS256', 'e': 'AQAB', 'kid': 'MLLSDGLY9oSsDzqSk2QfAr3wZYqV8czz/Q+OvQbyTzI=', 'kty': 'RSA', 'n': '3YGDMtLfuu9VNbjM-jFmjQs3y7N3xFe9uGbCzvPR5PD4pMMrSNGn0inTSJnqYU9Fek1mpJ4TkaMUzdqafRYRh4NyWTXqByS8Q-VoAdsNQqQ2tppwi6IXVZr_efKAyMnpAyP4RpEyUnQ68Z4URtav0c432WQUnKfGNgV15Oryumykpmk3ohq0vJBxGpcR47cGMZwUriZhSk_bWkyF4zVs-mAu3Hzs0jWZb-Nnni8VffvmyuvSybSZF2SQAYgwUdv8e77yRjQcF1M84c1jNJ1ko7PexqHi1t92FD69Wb-4d1jth17yiJZkFjOYCJLRbGAWOVw7ACqfIZ6-v6dQpeqlXw', 'use': 'sig' }] };

export function validateToken(token) {
    const header = decodeTokenHeader(token);
    const jsonWebKey = getJsonWebKeyWithKID(header.kid);
    const decodedToken = verifyJsonWebTokenSignature(token, jsonWebKey)
    if (decodedToken.exp > Math.round(Date.now() / 1000)) {
        if (decodedToken.aud === CLIENT_ID && decodedToken.iss === (`https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`)) {
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

const getJsonWebKeyWithKID = (kid) => {
    for (let jwk of jsonWebKeys.keys) {
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
