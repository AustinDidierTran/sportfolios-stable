import React, { useMemo } from 'react';
import { CardMedia } from '@material-ui/core';

import styles from './ImageCard.module.css';

export default function ImageCard(props) {
  const { photoUrl, ...otherProps } = props;

  const image = useMemo(
    () =>
      photoUrl
        ? photoUrl
        : 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200716-u8zhq-8317ff33-3b04-49a1-afd3-420202cddf73',
    [photoUrl],
  );

  return (
    <CardMedia
      image={image}
      {...otherProps}
      className={(props.className, styles.card)}
    ></CardMedia>
  );
}
