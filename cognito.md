# AWS Cognito
## Table of content
- [AWS Cognito](#aws-cognito)
  - [Table of content](#table-of-content)
- [Options possibles](#options-possibles)
  - [Amplify](#amplify)
  - [amazon-cognito-identity-js](#amazon-cognito-identity-js)
  - [Cognito AWS SDK](#cognito-aws-sdk)
- [Step to integrate with amazon-cognito-identity-js](#step-to-integrate-with-amazon-cognito-identity-js)
- [JWT Token](#jwt-token)

# Options possibles
## Amplify
- Its a client library. 
- It's can be use in web app or mobile app. 
- Contains customizeable UI components for easy auth implementation.

Code exemple:
```javascript
import Amplify, { Auth } from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_ZPwVcZizN',
    userPoolWebClientId: '658l7npr63jq5ohbk2gl2jvf6',
  },
})

;(async () => {
  const form = document.querySelector('.form')
  const email = document.querySelector('.email')
  const password = document.querySelector('.password')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    try {
      const res = await signUp(email.value, password.value)
      console.log('Signup success. Result: ', res)
    } catch (e) {
      console.log('Signup fail. Error: ', e)
    }
  })
})()

async function signUp(email, password) {
  return Auth.signUp({
    username: email,
    password,
    attributes: {
      email,
    },
  })
}
```
Exemple response:
```javascript
{
  "user": {
    "username": "max@maxivanov.io",
    "pool": {
      "userPoolId": "us-east-1_ZPwVcZizN",
      "clientId": "658l7npr63jq5ohbk2gl2jvf6",
      "client": {
        "endpoint": "https://cognito-idp.us-east-1.amazonaws.com/",
        "fetchOptions": {}
      },
      "advancedSecurityDataCollectionFlag": true,
      "storage": {}
    },
    "Session": null,
    "client": {
      "endpoint": "https://cognito-idp.us-east-1.amazonaws.com/",
      "fetchOptions": {}
    },
    "signInUserSession": null,
    "authenticationFlowType": "USER_SRP_AUTH",
    "storage": {},
    "keyPrefix": "CognitoIdentityServiceProvider.658l7npr63jq5ohbk2gl2jvf6",
    "userDataKey": "CognitoIdentityServiceProvider.658l7npr63jq5ohbk2gl2jvf6.max@maxivanov.io.userData"
  },
  "userConfirmed": false,
  "userSub": "68afb047-37d1-4efc-bc11-26056d1657c8",
  "codeDeliveryDetails": {
    "AttributeName": "email",
    "DeliveryMedium": "EMAIL",
    "Destination": "m***@m***.io"
  }
}
```
## amazon-cognito-identity-js
- Work in great in backend
- Can be use in frontend but need more management
- It doesn't support secret-enabled Cognito app clients ("Generate client secret" must be unchecked in the app client settings.)

Code exemple
```javascript
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'

import { promisify } from 'util'

const userPoolId = 'us-east-1_ZPwVcZizN'
const clientId = '658l7npr63jq5ohbk2gl2jvf6'
const email = 'max@maxivanov.io'
const password = '12345678'

;(async () => {
  const userPool = new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
  })

  try {
    const res = await signUp(userPool, email, password)
    console.log('Signup success. Result: ', res)
  } catch (e) {
    console.log('Signup fail. Error: ', e)
  }
})()

async function signUp(userPool, email, password) {
  const emailAttribute = new CognitoUserAttribute({
    Name: 'email',
    Value: email,
  })

  let attributes = [emailAttribute]

  const promisifiedSignUp = promisify(userPool.signUp).bind(userPool)

  return promisifiedSignUp(email, password, attributes, null)
}
```

## Cognito AWS SDK
- Work in great in backend
- Not a great experience in frontend
- It support secret-enabled Cognito app clients.

Code exemple
```javascript
mport { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider'

import crypto from 'crypto'

const clientId = '5cdgugg1eko9cm7u1u3spnaf37'
const clientSecret = '7j3v7ag5avt2pegj45lad3f7f0lpdikhm2o6oiae9arii1pbqn0'
const email = 'max@maxivanov.io'
const password = '12345678'

;(async () => {
  var params = {
    ClientId: clientId,
    Password: password,
    Username: email,
    SecretHash: hashSecret(clientSecret, email, clientId),
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  }

  const provider = new CognitoIdentityProvider({ region: 'us-east-1' })

  try {
    const res = await provider.signUp(params)
    console.log('Signup success. Result: ', res)
  } catch (e) {
    console.log('Signup fail. Error: ', e)
  }
})()

function hashSecret(clientSecret, username, clientId) {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64')
}
```

Exemple response:
```javascript
{
  "$metadata": {
    "httpStatusCode": 200,
    "requestId": "64abc24c-1ff6-451e-a335-a61f89813acd",
    "attempts": 1,
    "totalRetryDelay": 0
  },
  "CodeDeliveryDetails": {
    "AttributeName": "email",
    "DeliveryMedium": "EMAIL",
    "Destination": "m***@m***.io"
  },
  "UserConfirmed": false,
  "UserSub": "3c434ca4-14f9-4549-97f9-88b549a9b1e7"
}
```

code source: 
https://www.maxivanov.io/aws-cognito-amplify-vs-amazon-cognito-identity-js-vs-aws-sdk/#amazon-cognito-identity-js

Tuto:
https://github.com/AlexzanderFlores/Worn-Off-Keys-Cognito-Tutorials

# Step to integrate with amazon-cognito-identity-js
1. Create user pool with this [steps](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-with-cognito-user-pools.html) ([necesites permissions](https://docs.aws.amazon.com/cognito/latest/developerguide/security_iam_id-based-policy-examples.html))
2. Add a configuration for the backend to connect to aws cognito
   - PoolId
   - AppClientId
   - complete domain address
3. In Backend, add a new route and service for login,logout and signin which call amazon cognito 
   - If cognito didn't find user on login, call the old route and service
4. Add or get information to our Database
5. Modify UI route for the news ones


# JWT Token
After signin with cognito, the user receive a JWT Token.
Structure of the JWT
1. Header
2. Payload
3. Signature
   
To decrypte the token, you need to use the public JSON Web Key from cognito. The location of the token is https:<span>//</span>cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json

With that token you can decode the header and verify which key was used to secure the JWS sent from the user.

after, you can decode the token and get the user info.
```javascript
{
  sub: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  email_verified: true,
  iss: 'https://cognito-idp.{region}.amazonaws.com/{userPoolId}',
  'cognito:username': 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  origin_jti: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  aud: 'app-client-ID',
  event_id: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  token_use: 'token_use ',
  auth_time: 1632753503,
  exp: 1632757103,
  iat: 1632753503,
  jti: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  email: 'XXXXXXXXXXXX@XXXXXXXX.XX'
}
```
token_use can be id if ID token is sent and access if Access token is sent.

