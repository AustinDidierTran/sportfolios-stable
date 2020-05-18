import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';

export default function CustomListItemIcon(props) {
  return <ListItemIcon {...props}>{props.children}</ListItemIcon>;
}
