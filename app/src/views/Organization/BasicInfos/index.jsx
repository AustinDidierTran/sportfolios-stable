import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BasicInfos.module.css';
import BecomeMember from './BecomeMember';
import Donate from './Donate';

import { Avatar } from '../../../components/Custom';
import { Card, Typography, Container } from '../../../components/MUI';

export default function BasicInfos(props) {
  const { t } = useTranslation();

  return (
    <Container className={styles.card}>
      <Avatar
        className={styles.avatar}
        initials="FQU"
        photoUrl={
          'https://scontent.fymq2-1.fna.fbcdn.net/v/t1.0-9/66500989_10156181959966712_1462670276796874752_n.png?_nc_cat=102&_nc_sid=85a577&_nc_oc=AQmzziZEsG-RlLkW4MgiZgP6B7jjjjMbP24lyLJrYd32c6jevFEdoQLXMwDV-euRsMQ&_nc_ht=scontent.fymq2-1.fna&oh=e26d067f63be9d9c2fe46bf5a6f1a469&oe=5EEB812B'
        }
        size="lg"
      />
      <Typography variant="h3" className={styles.titre}>
        Fédération Québécoise d'Ultimate
      </Typography>
      <Container className={styles.container}>
        <BecomeMember className={styles.member} />
        <Donate className={styles.donate} />
      </Container>
    </Container>
  );
}
