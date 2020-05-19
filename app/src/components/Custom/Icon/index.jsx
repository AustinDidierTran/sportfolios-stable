import React from 'react';

import Add from '@material-ui/icons/Add';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Person from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Publish from '@material-ui/icons/Publish';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import Search from '@material-ui/icons/Search';

const icons = {
  Add,
  AddAPhoto,
  AddShoppingCart,
  AttachMoney,
  Check,
  Close,
  Delete,
  Edit,
  NavigateNext,
  Person,
  PersonAdd,
  Publish,
  RemoveShoppingCart,
  Search,
};

export default function CustomIcon(props) {
  const { icon } = props;

  const Icon = icons[icon];

  return <Icon />;
}
