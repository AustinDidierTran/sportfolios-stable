import React from 'react';

import Add from '@material-ui/icons/Add';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Business from '@material-ui/icons/Business';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Deck from '@material-ui/icons/Deck';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import Event from '@material-ui/icons/Event';
import Folder from '@material-ui/icons/Folder';
import Flag from '@material-ui/icons/Flag';
import Home from '@material-ui/icons/Home';
import Info from '@material-ui/icons/Info';
import Lock from '@material-ui/icons/Lock';
import Mail from '@material-ui/icons/Mail';
import Menu from '@material-ui/icons/Menu';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Notifications from '@material-ui/icons/Notifications';
import Person from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Publish from '@material-ui/icons/Publish';
import Receipt from '@material-ui/icons/Receipt';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import Search from '@material-ui/icons/Search';
import Settings from '@material-ui/icons/Settings';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import ShoppingCartOutlined from '@material-ui/icons/ShoppingCartOutlined';
import SportsKabaddi from '@material-ui/icons/SportsKabaddi';
import Store from '@material-ui/icons/Store';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircle from '@material-ui/icons/AccountCircle';

const icons = {
  Add,
  AddAPhoto,
  AddShoppingCart,
  AttachMoney,
  Business,
  Check,
  Close,
  Deck,
  Delete,
  Edit,
  EmojiEvents,
  Event,
  Flag,
  Folder,
  Home,
  Info,
  Lock,
  Mail,
  Menu,
  NavigateNext,
  Notifications,
  Person,
  PersonAdd,
  PeopleIcon,
  Publish,
  Receipt,
  RemoveShoppingCart,
  Search,
  Settings,
  ShoppingCart,
  ShoppingCartOutlined,
  SportsKabaddi,
  Store,
  SupervisedUserCircle,
  SaveIcon,
  PrintIcon,
  ShareIcon,
  FavoriteIcon,
  EditIcon,
  AccountCircle,
};

export default function CustomIcon(props) {
  const { icon } = props;

  const Icon = icons[icon];

  return <Icon />;
}
