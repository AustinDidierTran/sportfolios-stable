import { FORM_DIALOG_TYPE_ENUM } from '../../../../../common/enums';
import AddEventPaymentOption from './AddEventPaymentOption';
import EditEventPaymentOption from './EditEventPaymentOption';
import AddMember from './AddMember';
import AddMembership from './AddMembership';
import BecomeMember from './BecomeMember';
import MembersReport from './MembersReport';
import SalesReport from './SalesReport';
import EditMembership from './EditMembership';
import EnterEmail from './EnterEmail';
import CreateTaxRate from './CreateTaxRate';
import RosterPlayerOptions from './RosterPlayerOptions';
import SubmitScoreAndSpiritForm from './SubmitScoreSpiritForm';

const FormDialogMap = {
  [FORM_DIALOG_TYPE_ENUM.ADD_EVENT_PAYMENT_OPTION]: AddEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.EDIT_EVENT_PAYMENT_OPTION]: EditEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBER]: AddMember,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP]: AddMembership,
  [FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER]: BecomeMember,
  [FORM_DIALOG_TYPE_ENUM.MEMBERS_REPORT]: MembersReport,
  [FORM_DIALOG_TYPE_ENUM.SALES_REPORT]: SalesReport,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP]: EditMembership,
  [FORM_DIALOG_TYPE_ENUM.ENTER_EMAIL]: EnterEmail,
  [FORM_DIALOG_TYPE_ENUM.ROSTER_PLAYER_OPTIONS]: RosterPlayerOptions,
  [FORM_DIALOG_TYPE_ENUM.SUBMIT_SCORE_AND_SPIRIT]: SubmitScoreAndSpiritForm,
  [FORM_DIALOG_TYPE_ENUM.CREATE_TAX_RATE]: CreateTaxRate,
};

export default function FormDialogFactory(props) {
  const { type } = props;

  const FormDialog = FormDialogMap[type];

  if (!FormDialog) {
    /* eslint-disable-next-line */
    console.error(`${type} is not supported in FormDialogFactory`);
    return <div></div>;
  }

  return FormDialog;
}
