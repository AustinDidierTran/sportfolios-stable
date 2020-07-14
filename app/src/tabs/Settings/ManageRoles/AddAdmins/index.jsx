import React from 'react';

import { SearchList } from '../../../../components/Custom';

import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../../hooks/forms';

export default function AddAdmins(props) {
  const { t } = useTranslation();
  const { onClick, blackList } = props;
  const query = useFormInput('');

  return (
    <SearchList
      label={t('add_editor')}
      query={query}
      onClick={onClick}
      blackList={blackList}
    />
  );
}
