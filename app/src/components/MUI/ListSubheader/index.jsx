import React from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';

export default function CustomListSubheader(props) {
  return <ListSubheader {...props}>{props.children}</ListSubheader>;
}
