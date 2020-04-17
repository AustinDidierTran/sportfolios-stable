import React from 'react';
import List from '@material-ui/core/List';

export default function CustomList(props) {
  return <List {...props}>{props.children}</List>;
}
