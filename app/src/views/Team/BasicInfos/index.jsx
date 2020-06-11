import React from 'react';

import styles from './BasicInfos.module.css';
import BecomeMember from './Subscribe';
import Donate from './Donate';

import { Avatar } from '../../../components/Custom';
import { Typography, Container } from '../../../components/MUI';

export default function BasicInfos() {
  const data = {
    photoUrl:
      'https://scontent.fymq3-1.fna.fbcdn.net/v/t31.0-8/16601694_1816442828595987_7062384760727602723_o.png?_nc_cat=108&_nc_sid=85a577&_nc_oc=AQmXIHZDgx6xtBhk7KqP4dMXYyd5RUvMOSfVar2w7PpSq-U01pTfEkPWsvfV-KgaRAA&_nc_ht=scontent.fymq3-1.fna&oh=bdb86d087861f779bd545cbb3cefba1f&oe=5EED9A24',
    name: "Sherbrooke Gentlemen's Club",
    initials: 'SGC',
  };

  return (
    <Container className={styles.card}>
      <Avatar
        className={styles.avatar}
        initials={data.initials}
        photoUrl={data.photoUrl}
        size="lg"
      />
      <Typography variant="h3" className={styles.title}>
        {data.name}
      </Typography>
      <Container className={styles.container}>
        <BecomeMember className={styles.member} />
        <Donate className={styles.donate} />
      </Container>
    </Container>
  );
}
