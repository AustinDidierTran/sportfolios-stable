import React, { useMemo } from 'react';
import { CardMedia } from '@material-ui/core';

import styles from './ImageCard.module.css';
import { IMAGE_ENUM } from '../../../../../common/enums';

export default function ImageCard(props) {
  const { photoUrl, ...otherProps } = props;

  const image = useMemo(
    () => (photoUrl ? photoUrl : IMAGE_ENUM.ULTIMATE_TOURNAMENT),
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
