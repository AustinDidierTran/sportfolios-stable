import React from 'react';

import { Tooltip } from '@material-ui/core';

import { Icon } from '../../Custom';
import { IconButton } from '../../MUI';

export default function CustomIconButton(props) {
  const {
    icon = 'Add',
    onClick = () => {},
    size = 'small',
    tooltip = '',
    ...otherProps
  } = props;

  return (
    <Tooltip title={tooltip}>
      <IconButton
        size={size}
        onClick={onClick}
        {...otherProps}
        style={{ color: '#fff', ...props.style }}
      >
        <Icon icon={icon} />
      </IconButton>
    </Tooltip>
  );
}
