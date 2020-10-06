import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageAndButtons } from '../../components/Custom';
import { goTo, ROUTES } from '../../actions/goTo';
export default function TransferPersonExpired() {
  const { t } = useTranslation();
  const buttons = [
    {
      type: 'submit',
      name: t('ok'),
      color: 'primary',
      onClick: () => goTo(ROUTES.home),
    },
  ];
  return (
    <div>
      <MessageAndButtons
        message={t('person_transfer_expired')}
        buttons={buttons}
      />
    </div>
  );
}
