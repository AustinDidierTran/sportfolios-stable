import React, { useEffect } from 'react';

import General from './General';
import { IgContainer } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';

export default function Main() {
  useEffect(() => {
    document.title = formatPageTitle('Home');
  }, []);

  return (
    <IgContainer>
      <General />
    </IgContainer>
  );
}
