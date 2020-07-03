import React from 'react';

import { Button } from '../../MUI';
import { Icon } from '../../Custom';

export default function CustomButton(props) {
  const endIcon = props.endIcon ? (
    <Icon icon={props.endIcon} />
  ) : (
    <></>
  );
  return (
    <Button
      size={props.size || 'small'}
      color="primary"
      variant="contained"
      {...props}
      style={{
        color: 'white',
        ...props.style,
      }}
      endIcon={endIcon}
    />
  );
}
