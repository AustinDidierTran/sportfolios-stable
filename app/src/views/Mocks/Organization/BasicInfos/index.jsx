import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BasicInfos.module.css';
import BecomeMember from './BecomeMember';

import { Avatar } from '../../../../components/Custom';
import {
  Card,
  Typography,
  TextField,
} from '../../../../components/MUI';

export default function BasicInfos(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <Avatar
        className={styles.avatar}
        initials="FQU"
        photoUrl={
          'https://pbs.twimg.com/profile_images/2171703902/fqu_logo_400x400.jpg'
        }
        size="lg"
      />
      <Typography variant="h3">
        Fédération Québécoise d'Ultimate
      </Typography>

      <TextField disabled value={t('founded_in') + ' 2003'} />
      <BecomeMember />
    </Card>
  );
}
