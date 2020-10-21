import React, { useEffect } from 'react';

import General from './General';
import { IgContainer } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import BottomPageLogo from '../../components/Custom/BottomPageLogo';

export default function Main() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('home'));
  }, []);

  return (
    <IgContainer>
      <General />
      <BottomPageLogo />
    </IgContainer>
  );
}
