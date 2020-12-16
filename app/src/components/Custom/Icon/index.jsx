import React from 'react';

import AccountBalance from '@material-ui/icons/AccountBalance';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Add from '@material-ui/icons/Add';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Assignment from '@material-ui/icons/Assignment';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Autorenew from '@material-ui/icons/Autorenew';
import Build from '@material-ui/icons/Build';
import Business from '@material-ui/icons/Business';
import Cancel from '@material-ui/icons/Cancel';
import CancelSend from '@material-ui/icons/CancelScheduleSend';
import Check from '@material-ui/icons/Check';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Close from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Create from '@material-ui/icons/Create';
import CreditCard from '@material-ui/icons/CreditCard';
import Deck from '@material-ui/icons/Deck';
import Delete from '@material-ui/icons/Delete';
import Dot from '@material-ui/icons/FiberManualRecord';
import DragIndicator from '@material-ui/icons/DragIndicator';
import Edit from '@material-ui/icons/Edit';
import EditIcon from '@material-ui/icons/Edit';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import EmojiObjects from '@material-ui/icons/EmojiObjects';
import Event from '@material-ui/icons/Event';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Facebook from '@material-ui/icons/Facebook';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import FileCopy from '@material-ui/icons/FileCopy';
import Flag from '@material-ui/icons/Flag';
import Folder from '@material-ui/icons/Folder';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import GetApp from '@material-ui/icons/GetApp';
import GridOn from '@material-ui/icons/GridOn';
import Group from '@material-ui/icons/Group';
import Home from '@material-ui/icons/Home';
import Help from '@material-ui/icons/Help';
import Info from '@material-ui/icons/Info';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Link from '@material-ui/icons/Link';
import Lock from '@material-ui/icons/Lock';
import Mail from '@material-ui/icons/Mail';
import Menu from '@material-ui/icons/Menu';
import MoneyOff from '@material-ui/icons/MoneyOff';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Notifications from '@material-ui/icons/Notifications';
import OpenWith from '@material-ui/icons/OpenWith';
import PeopleIcon from '@material-ui/icons/People';
import Person from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Power from '@material-ui/icons/PowerSettingsNew';
import PrintIcon from '@material-ui/icons/Print';
import Publish from '@material-ui/icons/Publish';
import RateReview from '@material-ui/icons/RateReview';
import Receipt from '@material-ui/icons/Receipt';
import Remove from '@material-ui/icons/Remove';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import Reorder from '@material-ui/icons/Reorder';
import Replay from '@material-ui/icons/Replay';
import SaveIcon from '@material-ui/icons/Save';
import Search from '@material-ui/icons/Search';
import Send from '@material-ui/icons/Send';
import Settings from '@material-ui/icons/Settings';
import ShareIcon from '@material-ui/icons/Share';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import ShoppingCartOutlined from '@material-ui/icons/ShoppingCartOutlined';
import SportsKabaddi from '@material-ui/icons/SportsKabaddi';
import SportsWhistle from '@material-ui/icons/Sports';
import Stars from '@material-ui/icons/Stars';
import Store from '@material-ui/icons/Store';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import TextFormat from '@material-ui/icons/TextFormat';
import Undo from '@material-ui/icons/Undo';
import Chat from '@material-ui/icons/Chat';
import ExpandLess from '@material-ui/icons/ExpandLess';

const icons = {
  AccountBalance,
  AccountCircle,
  Add,
  AddAPhoto,
  AddShoppingCart,
  ArrowBack,
  ArrowDropDown,
  ArrowUpward,
  Assignment,
  AttachMoney,
  Autorenew,
  Build,
  Business,
  Check,
  CheckCircle,
  CheckCircleOutline,
  Chat,
  Close,
  CloudUploadIcon,
  Cancel,
  CancelSend,
  Create,
  CreditCard,
  Deck,
  Delete,
  Dot,
  DragIndicator,
  Edit,
  EditIcon,
  EmojiEvents,
  EmojiObjects,
  Event,
  ExitToApp,
  ExpandMore,
  Facebook,
  FavoriteIcon,
  FiberManualRecord,
  FileCopy,
  Flag,
  Folder,
  FormatListNumbered,
  GetApp,
  GridOn,
  Group,
  Home,
  Help,
  Info,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Link,
  Lock,
  Mail,
  Menu,
  MoneyOff,
  NavigateNext,
  Notifications,
  OpenWith,
  PeopleIcon,
  Person,
  PersonAdd,
  Power,
  PrintIcon,
  Publish,
  RateReview,
  Receipt,
  Remove,
  RemoveShoppingCart,
  Reorder,
  Replay,
  SaveIcon,
  Search,
  Send,
  Settings,
  ShareIcon,
  ShoppingCart,
  ShoppingCartOutlined,
  SportsKabaddi,
  SportsWhistle,
  Stars,
  Store,
  SupervisedUserCircle,
  TextFormat,
  Undo,
  ExpandLess,
  ExpandMore,
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
