import React from 'react';
import { useFeature } from '@optimizely/react-sdk';
import FeatureComingSoon from './FeatureComingSoon';
import { FEATURE_FLAGS } from '../../../../../common/flags';

export default function FeatureContainer(props) {
  const { children, feature, options = {} } = props;

  if (!feature) {
    return children;
  }

  if (!Object.values(FEATURE_FLAGS).includes(feature)) {
    return children;
  }

  const [enabled] = useFeature(feature);

  if (enabled) {
    return children;
  }

  if (options.displayComingSoon) {
    return <FeatureComingSoon />;
  }

  return null;
}
