import aws from 'aws-sdk';
import { USER_POOL_ID, REGION } from '../../../../conf.js';

import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method

try {
  keys = require('./keys/aws-keys.json');
} catch (e) {
  /* eslint-disable-next-line */
  console.log(
    `There is an error, keys are probably simply not configured: ${e}`,
  );
}

const signS3Request = async (fileName, fileType) => {
  const finalFileName = `${process.env.NODE_ENV}/${fileName}`;

  const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'us-east-1',
    endpoint: new aws.Endpoint(
      'sportfolios-images.s3-accelerate.amazonaws.com',
    ),
    useAccelerateEndpoint: true,
  });

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: finalFileName,
    Expires: 3600,
    ContentType: fileType,
    ACL: 'public-read',
  };

  const signedRequest = await s3.getSignedUrl('putObject', s3Params);
  const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${finalFileName}`;

  return { signedRequest, url };
};

export const adminGetUser = async (email) => {
  aws.config.region = REGION; // Region
  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider()
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: email,
  };

  const data = new Promise((resolve, reject) => cognitoidentityserviceprovider.adminGetUser(params, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  }));
  return data.then((value) => {
    return value
  });
};

export const adminCreateUser = async (email, password) => {
  aws.config.region = REGION; // Region
  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider()

  const params = {
    UserPoolId: USER_POOL_ID,
    Username: email,
    MessageAction: 'SUPPRESS', //suppress the sending of an invitation to the user
    TemporaryPassword: password,
    UserAttributes: [
      { Name: 'email', Value: email }, //using sign-in with email, so username is email
      { Name: 'email_verified', Value: 'true' }]
  };
  const data = new Promise((resolve, reject) => cognitoidentityserviceprovider.adminCreateUser(params, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  }));

  return data.then((value) => {
    return value
  });
};

export { signS3Request };
