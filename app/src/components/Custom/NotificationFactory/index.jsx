import React from 'react';

// import Follow from './Follow'; TODO: Merge both Follow components together.
import Follow from '../../../views/Notifications/Follow';

export default function NotificationFactory(props) {
  const { type, ...otherProps } = props;

  return type == 'follow' ? <Follow {...otherProps} /> : <></>;
}
