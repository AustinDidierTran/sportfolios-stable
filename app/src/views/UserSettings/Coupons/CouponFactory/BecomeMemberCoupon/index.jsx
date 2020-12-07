import React from 'react';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../../../../common/enums';
import { FormDialog } from '../../../../../components/Custom';

export default function BecomeMemberCoupon(props) {
  const { items, open, onClose } = props;

  return (
    <FormDialog
      type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER_COUPON}
      items={{ items, open, onClose }}
    />
  );
}
