const optimizelySDK = require('@optimizely/optimizely-sdk');
const conf = require('../../../../conf');
const { FEATURE_FLAGS } = require('../../../../common/flags');
const { ERROR_ENUM } = require('../../../../common/errors');

const optimizelyClientInstance = optimizelySDK.createInstance({
  sdkKey: conf.optimizely.sdkKey,
});

const handleFlag = (flag, userId) => {
  const enabled = optimizelyClientInstance.isFeatureEnabled(
    flag,
    userId,
  );

  if (!enabled) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
};

module.exports = {
  FEATURE_FLAGS,
  handleFlag,
  optimizelyClientInstance,
};
