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
    fontSize = 'default',
    ...otherProps
  } = props;
  return (
    <Tooltip title={tooltip}>
      <div>
        <IconButton
          size={size}
          onClick={onClick}
          {...otherProps}
          style={{ color: '#fff', ...props.style }}
        >
          <Icon icon={icon} fontSize={fontSize} />
        </IconButton>
      </div>
    </Tooltip>
  );
}
