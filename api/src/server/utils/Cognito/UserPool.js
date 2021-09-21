import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { USER_POOL_ID, CLIENT_ID } from '../../../../../conf.js';

export default new CognitoUserPool({ USER_POOL_ID, CLIENT_ID });