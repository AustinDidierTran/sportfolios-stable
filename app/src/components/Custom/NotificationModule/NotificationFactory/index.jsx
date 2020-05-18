import React from 'react';

import Follow from './Follow';

export default function NotificationFactory(props) {
  const { type, ...otherProps } = props;

  if (type === 'follow') {
    return <Follow {...otherProps} />;
  }
}
