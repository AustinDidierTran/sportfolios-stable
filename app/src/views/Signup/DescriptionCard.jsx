import React from 'react';

import styles from './Signup.module.css';

import {
  Card,
  CardContent,
  TextField,
  Typography
} from '../../components/MUI';
import { useTranslation } from 'react-i18next';


export default function DescriptionCard() {
  const { t } = useTranslation();

  return (<Card className={styles.description}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">{t('signup')}</Typography>
    </CardContent>
  </Card>)
}