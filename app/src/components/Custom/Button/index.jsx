import React from 'react';

import Button from '@material-ui/core/Button';
import { Icon } from '../../Custom';

export default function CustomButton(props) {
  const {
    color,
    variant,
    textColor,
    style,
    size,
    ...otherProps
  } = props;

  let defaultTextColor = 'white';
  if (variant === 'outlined' || variant === 'text') {
    defaultTextColor = 'primary';
  }

  const endIcon = props.endIcon ? (
    <Icon icon={props.endIcon} />
  ) : null;
  return (
    <Button
      size={size || 'small'}
      variant={variant || 'contained'}
      color={color || 'primary'}
      {...otherProps}
      style={{
        color: textColor || defaultTextColor,
        ...style,
      }}
      endIcon={endIcon}
    />
  );
}
