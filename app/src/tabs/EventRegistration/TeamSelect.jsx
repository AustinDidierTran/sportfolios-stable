import React from 'react';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { SearchList } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import TeamItem from '../../components/Custom/List/TeamItem';

export default function TeamSelect(props) {
  const { t } = useTranslation();
  const { onClick, team } = props;
  const query = useFormInput('');

  if (team) {
    return (
      <>
        <TeamItem {...team} secondary="Selected Team" />
        <SearchList
          label={t('select_team')}
          type={GLOBAL_ENUM.TEAM}
          onClick={onClick}
          query={query}
        />
      </>
    );
  }

  return (
    <SearchList
      clearOnSelect={false}
      label={t('select_team')}
      type={GLOBAL_ENUM.TEAM}
      onClick={onClick}
      query={query}
    />
  );
}
