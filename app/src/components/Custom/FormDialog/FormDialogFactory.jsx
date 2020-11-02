import { FORM_DIALOG_TYPE_ENUM } from '../../../../../common/enums';
import EnterEmail from './EnterEmail';
import SubmitScoreAndSpiritForm from './SubmitScoreSpiritForm';
import AddEditEventPaymentOption from './AddEditEventPaymentOption';
import AddMembership from './AddMembership';
import BecomeMember from './BecomeMember';
import AddMember from './AddMember';
import EditMembership from './EditMembership';

const FormDialogMap = {
  [FORM_DIALOG_TYPE_ENUM.SUBMIT_SCORE_AND_SPIRIT]: SubmitScoreAndSpiritForm,
  [FORM_DIALOG_TYPE_ENUM.ADD_EDIT_EVENT_PAYMENT_OPTION]: AddEditEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP]: AddMembership,
  [FORM_DIALOG_TYPE_ENUM.ENTER_EMAIL]: EnterEmail,
  [FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER]: BecomeMember,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBER]: AddMember,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP]: EditMembership,
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
