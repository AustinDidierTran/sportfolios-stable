import React from 'react';

import Button from '@material-ui/core/Button';
import { Icon } from '../../Custom';

export default function CustomButton(props) {
  const { color, variant } = props;

  let theColor = 'primary';
  let textColor = 'white';
  if (color === 'secondary') {
    theColor = 'secondary';
  }
  if (variant === 'outlined' || variant === 'text') {
    textColor = 'primary';
  }

  const endIcon = props.endIcon ? (
    <Icon icon={props.endIcon} />
  ) : (
    <></>
  );
  return (
    <Button
      size={props.size || 'small'}
      variant="contained"
      color={theColor}
      {...props}
      style={{
        color: textColor,
        ...props.style,
      }}
      endIcon={endIcon}
    />
  );
}
