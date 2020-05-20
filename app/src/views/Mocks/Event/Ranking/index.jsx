import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
} from '../../../../components/MUI';

import styles from './Ranking.module.css';
import { useTranslation } from 'react-i18next';

export default function Ranking(props) {
  const { t } = useTranslation();

  return <h1>Ranking</h1>;
}
