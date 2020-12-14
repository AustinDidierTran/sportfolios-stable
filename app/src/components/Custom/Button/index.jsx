import React, { useMemo } from 'react';

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

  const startIcon = useMemo(() => {
    if (!props.startIcon) {
      return null;
    }
    return <Icon icon={props.startIcon} />;
  }, [props.startIcon]);

  const endIcon = useMemo(() => {
    if (!props.endIcon) {
      return null;
    }
    return <Icon icon={props.endIcon} />;
  }, [props.endIcon]);

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
      startIcon={startIcon}
      endIcon={endIcon}
    />
  );
}
