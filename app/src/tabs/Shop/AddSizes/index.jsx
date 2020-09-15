import React from 'react';
import { useTranslation } from 'react-i18next';
import { SIZES_ENUM } from '../../../../../common/enums';
import { MultiSelect } from '../../../components/Custom';

export default function AddSizes(props) {
  const { t } = useTranslation();
  const { handleChange, sizes } = props;
  const options = Object.keys(SIZES_ENUM);

  return (
    <MultiSelect
      label={t('sizes')}
      values={sizes}
      onChange={handleChange}
      options={options}
    />
  );
}
