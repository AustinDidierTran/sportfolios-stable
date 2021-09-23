import aws from 'aws-sdk';

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

export const getCognitoidentityserviceprovider = async () => {
  aws.config.region = 'us-west-2'; // Region

  return new aws.CognitoIdentityServiceProvider()
};

export { signS3Request };
