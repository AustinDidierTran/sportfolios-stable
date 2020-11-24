import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CARD_TYPE_ENUM,
  FORM_DIALOG_TYPE_ENUM,
} from '../../../../../common/enums';
import { goTo } from '../../../actions/goTo';
import { Card, FormDialog } from '../../../components/Custom';
import { useQuery } from '../../../hooks/queries';

export default function MembersReport() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { id } = useQuery();

  const onClose = () => {
    setOpen(false);
  };

  const handleCreated = () => {
    goTo(`/${id}?tab=settings`);
  };

  return (
    <>
      <Card
        items={{
          title: t('sales'),
          description: t('sales_report_description'),
          onClick: () => {
            setOpen(true);
          },
        }}
        type={CARD_TYPE_ENUM.REPORT}
      ></Card>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.SALES_REPORT}
        items={{
          open,
          onClose,
          handleCreated,
        }}
      />
    </>
  );
}
