import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';

export default function CustomCardMedia(props) {
  const { photoUrl } = props;
  if (photoUrl) {
    return <CardMedia image={photoUrl} {...props} />;
  }
  return (
    <CardMedia
      image={
        ' https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200716-u8zhq-8317ff33-3b04-49a1-afd3-420202cddf73   '
      }
      {...props}
    />
  );
}
