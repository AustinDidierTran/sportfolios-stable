import React from 'react';
import { MessageAndButtons } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const privacyPolicy =
    'https://sportfolios-images.s3.amazonaws.com/production/privacy-policy/privacy-policy.html';
  const termsConditions =
    'https://www.termsconditionstemplate.net/live.php?token=BCbkqtde4eVFO4unde1jCE7Wq6xucBzV';
  const message = t('privacy_policy_and_legal_documents');
  const buttons = [
    {
      href: privacyPolicy,
      name: t('privacy_policy'),
      color: 'primary',
      onClick: () => {},
    },
    {
      href: termsConditions,
      color: 'primary',
      name: t('terms_and_conditions'),
      onClick: () => {},
    },
  ];
  return (
    <MessageAndButtons
      message={message}
      buttons={buttons}
    ></MessageAndButtons>
  );
}
