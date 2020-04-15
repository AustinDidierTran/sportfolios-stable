const awsv4 = require('aws-signature-v4');

const aws = require('aws-sdk');

let keys;

try {
  keys = require('./keys/aws-keys.json');
} catch (e) {
  console.log(
    `There is an error, keys are probably simply not configured: ${e}`,
  );
}

const signS3Request = async (fileName, fileType) => {
  console.log('fileName', fileName);

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
    Key: fileName,
    Expires: 3600,
    ContentType: fileType,
    ACL: 'public-read',
  };

  const signedRequest = await s3.getSignedUrl('putObject', s3Params);
  const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;

  return { signedRequest, url };
};

// const signS3Request = fileName => {
//   const url = awsv4.createPresignedS3URL(fileName, {
//     bucket: 'sportfolios-image',
//     region: 'us-east-1',
//     expires: 3600,
//     key: keys.accessKeyId,
//     secret: keys.secretAccessKey,
//     method: 'PUT',
//     contentLengthRange: [0, 10485760],
//     headers: {
//       'x-amz-acl': 'public-read',
//     },
//   });

//   const request = awsv4.createCanonicalRequest(
//     'PUT',
//     fileName,
//     null,
//     {
//       'x-amz-acl': 'public-read',
//     },
//   );

//   return url;
// };

module.exports = {
  signS3Request,
};
