import React from 'react';

import { Tooltip } from '@material-ui/core';

import { IconButton } from '../../MUI';

import Add from '@material-ui/icons/Add';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Publish from '@material-ui/icons/Publish';

export default function CustomIconButton(props) {
  const {
    icon = 'Add',
    onClick = () => {},
    size = 'small',
    tooltip = '',
  } = props;

  const icons = {
    Add,
    AddAPhoto,
    Check,
    Close,
    Delete,
    Edit,
    Publish,
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
