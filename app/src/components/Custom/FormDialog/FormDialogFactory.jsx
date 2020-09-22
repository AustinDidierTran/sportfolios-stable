import { FORM_DIALOG_TYPE_ENUM } from '../../../../../common/enums';
import SubmitScoreAndSpiritForm from './SubmitScoreSpiritForm';

const FormDialogMap = {
  [FORM_DIALOG_TYPE_ENUM.SUBMIT_SCORE_AND_SPIRIT]: SubmitScoreAndSpiritForm,
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
