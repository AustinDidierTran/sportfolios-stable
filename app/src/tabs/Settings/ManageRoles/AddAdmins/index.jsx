import React from 'react';

import { SearchList } from '../../../../components/Custom';

import { GLOBAL_ENUM } from '../../../../../../common/enums';
import { useTranslation } from 'react-i18next';

export default function AddAdmins(props) {
  const { t } = useTranslation();
  const { onClick } = props;
  const query = useFormInput('');

  return (
    <SearchList
      label={t('add_editor')}
      type={GLOBAL_ENUM.PERSON}
      query={query}
      onClick={onClick}
    />
  );
}
