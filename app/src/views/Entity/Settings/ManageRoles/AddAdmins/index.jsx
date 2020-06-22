import React from 'react';

import {
  Container,
  SearchList,
} from '../../../../../components/Custom';

import { GLOBAL_ENUM } from '../../../../../../../common/enums';

export default function AddAdmins(props) {
  const { onClick } = props;

  return (
    <Container>
      <hr></hr>
      <SearchList type={GLOBAL_ENUM.PERSON} onClick={onClick} />
    </Container>
  );
}
