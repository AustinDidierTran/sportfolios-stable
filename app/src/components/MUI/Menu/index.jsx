import React from 'react';
import Menu from '@material-ui/core/Menu';

export default function CustomMenu(props) {
  return <Menu {...props}>{props.children}</Menu>;
}
