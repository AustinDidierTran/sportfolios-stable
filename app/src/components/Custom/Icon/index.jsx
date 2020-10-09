import React from 'react';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Add from '@material-ui/icons/Add';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Assignment from '@material-ui/icons/Assignment';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Autorenew from '@material-ui/icons/Autorenew';
import Business from '@material-ui/icons/Business';
import Cancel from '@material-ui/icons/Cancel';
import CancelSend from '@material-ui/icons/CancelScheduleSend';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Deck from '@material-ui/icons/Deck';
import Delete from '@material-ui/icons/Delete';
import DragIndicator from '@material-ui/icons/DragIndicator';
import Edit from '@material-ui/icons/Edit';
import EditIcon from '@material-ui/icons/Edit';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import EmojiObjects from '@material-ui/icons/EmojiObjects';
import Event from '@material-ui/icons/Event';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Flag from '@material-ui/icons/Flag';
import Folder from '@material-ui/icons/Folder';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import Group from '@material-ui/icons/Group';
import Home from '@material-ui/icons/Home';
import Info from '@material-ui/icons/Info';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Lock from '@material-ui/icons/Lock';
import Mail from '@material-ui/icons/Mail';
import Menu from '@material-ui/icons/Menu';
import MoneyOff from '@material-ui/icons/MoneyOff';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Notifications from '@material-ui/icons/Notifications';
import PeopleIcon from '@material-ui/icons/People';
import Person from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import PrintIcon from '@material-ui/icons/Print';
import Publish from '@material-ui/icons/Publish';
import Receipt from '@material-ui/icons/Receipt';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import Reorder from '@material-ui/icons/Reorder';
import SaveIcon from '@material-ui/icons/Save';
import Search from '@material-ui/icons/Search';
import Send from '@material-ui/icons/Send';
import Settings from '@material-ui/icons/Settings';
import ShareIcon from '@material-ui/icons/Share';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import ShoppingCartOutlined from '@material-ui/icons/ShoppingCartOutlined';
import SportsKabaddi from '@material-ui/icons/SportsKabaddi';
import Store from '@material-ui/icons/Store';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import Undo from '@material-ui/icons/Undo';

const icons = {
  AccountCircle,
  Add,
  AddAPhoto,
  AddShoppingCart,
  ArrowUpward,
  Assignment,
  AttachMoney,
  Autorenew,
  Business,
  Check,
  Close,
  Cancel,
  CancelSend,
  Deck,
  Delete,
  DragIndicator,
  Edit,
  EditIcon,
  EmojiEvents,
  EmojiObjects,
  Event,
  ExitToApp,
  ExpandMore,
  FavoriteIcon,
  FiberManualRecord,
  Flag,
  Folder,
  FormatListNumbered,
  Group,
  Home,
  Info,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Lock,
  Mail,
  Menu,
  MoneyOff,
  NavigateNext,
  Notifications,
  PeopleIcon,
  Person,
  PersonAdd,
  PrintIcon,
  Publish,
  Receipt,
  RemoveShoppingCart,
  Reorder,
  SaveIcon,
  Search,
  Send,
  Settings,
  ShareIcon,
  ShoppingCart,
  ShoppingCartOutlined,
  SportsKabaddi,
  Store,
  SupervisedUserCircle,
  Undo,
};

export default function CustomIcon(props) {
  const { icon, color = 'primary', onClick, fontSize } = props;

  const Icon = icons[icon];

  return (
    <Icon
      style={{ fill: color }}
      fontSize={fontSize}
      onClick={onClick}
    />
  );
}
