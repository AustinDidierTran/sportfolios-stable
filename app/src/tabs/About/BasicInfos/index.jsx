import React, { useState, useEffect } from 'react';
import styles from './BasicInfos.module.css';

import { Avatar } from '../../../components/Custom';
import { Container, Typography } from '../../../components/MUI';
import { getInitialsFromName } from '../../../utils/stringFormats';
import { useFormInput } from '../../../hooks/forms';

export default function BasicInfos(props) {
  const {
    name: nameProp,
    surname,
    photoUrl: initialPhotoUrl,
  } = props.basicInfos;

  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);

  useEffect(() => {
    setPhotoUrl(initialPhotoUrl);
  }, [initialPhotoUrl]);

  const initials = getInitialsFromName({ name: nameProp, surname });
  const name = useFormInput(nameProp);

  return (
    <Container className={styles.card}>
      <Avatar initials={initials} photoUrl={photoUrl} size="lg" />
      <div className={styles.fullName}>
        <Typography variant="h3" className={styles.text}>
          {`${name.value}${surname ? ' ' + surname : ''}`}
        </Typography>
      </div>
    </Container>
  );
}
