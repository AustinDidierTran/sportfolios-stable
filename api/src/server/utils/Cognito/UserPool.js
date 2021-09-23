import AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { USER_POOL_ID, CLIENT_ID } from '../../../../../conf.js';
const poolData = {
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID
};

export default new AmazonCognitoIdentity.CognitoUserPool(poolData);
