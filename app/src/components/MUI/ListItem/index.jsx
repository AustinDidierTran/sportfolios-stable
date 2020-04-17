import React from 'react';
import ListItem from '@material-ui/core/ListItem';

export default function CustomListItem(props) {
  return <ListItem {...props}>{props.children}</ListItem>;
}
