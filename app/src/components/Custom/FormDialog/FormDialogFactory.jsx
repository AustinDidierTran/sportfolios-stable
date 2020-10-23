import { FORM_DIALOG_TYPE_ENUM } from '../../../../../common/enums';
import EnterEmail from './EnterEmail';
import SubmitScoreAndSpiritForm from './SubmitScoreSpiritForm';
import AddMembership from './AddMembership';

const FormDialogMap = {
  [FORM_DIALOG_TYPE_ENUM.SUBMIT_SCORE_AND_SPIRIT]: SubmitScoreAndSpiritForm,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP]: AddMembership,
  [FORM_DIALOG_TYPE_ENUM.ENTER_EMAIL]: EnterEmail,
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
