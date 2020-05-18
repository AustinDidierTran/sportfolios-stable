import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BasicInfos.module.css';
<<<<<<< Updated upstream
=======
import BecomeMember from './BecomeMember';
import Donate from './Donate';
>>>>>>> Stashed changes

import { Avatar } from '../../../../components/Custom';
import {
  Card,
  Typography,
  Container,
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
      <Typography variant="h3" className={styles.titre}>
        Fédération Québécoise d'Ultimate
      </Typography>
<<<<<<< Updated upstream

      <TextField disabled value={t('founded_in') + ' 2003'} />
=======
      <Container className={styles.container}>
        <BecomeMember className={styles.member} />
        <Donate className={styles.donate} />
      </Container>
>>>>>>> Stashed changes
    </Card>
  );
}
