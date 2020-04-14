const awsv4 = require('aws-signature-v4');

let keys;

try {
  keys = require('./keys/aws-keys.json');
} catch (e) {
  console.log(
    `There is an error, keys are probably simply not configured: ${e}`,
  );
}

const signS3Request = fileName => {
  const url = awsv4.createPresignedS3URL(fileName, {
    bucket: 'sportfolios-image',
    region: 'us-east-1',
    expires: 3600,
    key: keys.accessKeyId,
    secret: keys.secretAccessKey,
    method: 'PUT',
    contentLengthRange: [0, 10485760],
    headers: {
      'x-amz-acl': 'public-read',
    },
  });

  const request = awsv4.createCanonicalRequest(
    'PUT',
    fileName,
    null,
    {
      'x-amz-acl': 'public-read',
    },
  );

  console.log('request', request);

  return url;
};

module.exports = {
  signS3Request,
};
