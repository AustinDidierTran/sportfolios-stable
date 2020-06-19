import React from 'react';

import {
  Container,
  SearchList,
} from '../../../../../components/Custom';

import { Typography } from '../../../../../components/MUI';

import { GLOBAL_ENUM } from '../../../../../../../common/enums';

import { useTranslation } from 'react-i18next';

export default function AddAdmins(props) {
  const { t } = useTranslation();

  const { onClick } = props;

  return (
    <Container>
      <Typography>{t('add_editor')}</Typography>
      <hr></hr>
      <SearchList type={GLOBAL_ENUM.PERSON} onClick={onClick} />
    </Container>
  );
}
