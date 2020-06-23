const optimizelySDK = require('@optimizely/optimizely-sdk');
const conf = require('../../../../conf');
const { FEATURE_FLAGS } = require('../../../../common/flags');

const optimizelyClientInstance = optimizelySDK.createInstance({
  sdkKey: conf.optimizely.sdkKey,
});

const handleFlag = (flag, userId) => {
  const enabled = optimizelyClientInstance.isFeatureEnabled(
    flag,
    userId,
  );

  if (!enabled) {
    throw 'Access Denied';
  }
};

module.exports = {
  FEATURE_FLAGS,
  handleFlag,
  optimizelyClientInstance,
};
