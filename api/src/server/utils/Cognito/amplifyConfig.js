import Amplify from 'aws-amplify';
import { INDENTITY_POOL_ID, REGION } from '../../../../../conf.js';

Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: INDENTITY_POOL_ID,

        // REQUIRED - Amazon Cognito Region
        region: REGION
    }
});
export default Amplify.Auth;