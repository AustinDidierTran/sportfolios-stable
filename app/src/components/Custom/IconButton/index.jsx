import React from 'react';

import { Tooltip } from '@material-ui/core';

import { IconButton } from '../../MUI';

import Add from '@material-ui/icons/Add';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

export default function CustomIconButton(props) {
  const {
    icon = 'Add',
    onClick = () => {},
    size = 'small',
    tooltip = '',
  } = props;

  const icons = {
    Add,
    Check,
    Close,
    Delete,
    Edit,
  };

  const Icon = icons[icon];

  return (
    <Tooltip title={tooltip}>
      <IconButton size={size} onClick={onClick}>
        <Icon />
      </IconButton>
    </Tooltip>
  );
}
