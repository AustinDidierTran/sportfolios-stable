import { CardActionArea } from '@material-ui/core';
import React from 'react';
import { Card, ListItemText } from '../../../MUI';

export default function Report(props) {
  const { title, description, onClick } = props;
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <ListItemText primary={title} secondary={description} />
      </CardActionArea>
    </Card>
  );
}
