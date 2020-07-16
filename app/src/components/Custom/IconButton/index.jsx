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
  } = props;

  return (
    <Tooltip title={tooltip}>
      <IconButton
        style={{ color: '#fff' }}
        size={size}
        onClick={onClick}
      >
        <Icon icon={icon} />
      </IconButton>
    </Tooltip>
  );
}
