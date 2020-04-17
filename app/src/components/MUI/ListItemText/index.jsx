import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';

export default function CustomListItemText(props) {
  return <ListItemText {...props}>{props.children}</ListItemText>;
}
