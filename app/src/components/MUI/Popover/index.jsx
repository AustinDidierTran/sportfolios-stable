import React from 'react';
import Popover from '@material-ui/core/Popover';

export default function CustomPopover(props) {
  return <Popover {...props}>{props.children}</Popover>;
}
