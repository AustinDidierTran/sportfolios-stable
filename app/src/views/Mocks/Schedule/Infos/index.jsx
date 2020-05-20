import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
} from '../../../../components/MUI';

import styles from './Infos.module.css';
import { useTranslation } from 'react-i18next';

export default function Infos(props) {
  const { t } = useTranslation();

  return <h1>Infos</h1>;
}
