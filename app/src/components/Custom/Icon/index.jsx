import React from 'react';

import Add from '@material-ui/icons/Add';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Publish from '@material-ui/icons/Publish';
import Search from '@material-ui/icons/Search';

const icons = {
  Add,
  AddAPhoto,
  Check,
  Close,
  Delete,
  Edit,
  Publish,
  Search,
};

export default function CustomIcon(props) {
  const { icon } = props;

  const Icon = icons[icon];

  return <Icon />;
}
