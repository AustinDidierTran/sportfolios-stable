import React from 'react';

import BasicInfos from './BasicInfos';
import OtherInfos from './OtherInfos';

import { Container } from '../../../components/MUI';

export default function selfProfile(props) {
  return (
    <Container>
      <BasicInfos />
      <br />
      <OtherInfos />
    </Container>
  );
}
