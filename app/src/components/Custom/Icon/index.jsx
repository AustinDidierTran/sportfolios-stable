import React from 'react';

import Add from '@material-ui/icons/Add';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import Event from '@material-ui/icons/Event';
import Folder from '@material-ui/icons/Folder';
import Home from '@material-ui/icons/Home';
import Info from '@material-ui/icons/Info';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Notifications from '@material-ui/icons/Notifications';
import Person from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Publish from '@material-ui/icons/Publish';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import Search from '@material-ui/icons/Search';
import Settings from '@material-ui/icons/Settings';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

const icons = {
  Add,
  AddAPhoto,
  AddShoppingCart,
  AttachMoney,
  Check,
  Close,
  Delete,
  Edit,
  EmojiEvents,
  Event,
  Folder,
  Home,
  Info,
  NavigateNext,
  Notifications,
  Person,
  PersonAdd,
  Publish,
  RemoveShoppingCart,
  Search,
  Settings,
  ShoppingCart,
};

export default function CustomIcon(props) {
  const { icon } = props;
  console.log('icon', icon);

  const Icon = icons[icon];

  return <Icon />;
}
