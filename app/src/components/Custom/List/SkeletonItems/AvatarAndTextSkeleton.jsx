import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { uniqueId } from 'lodash';
import React from 'react';

export default function AvatarAndTextSkeleton(props) {
  const { quantity } = props;
  const item = (
    <ListItem>
      <ListItemAvatar>
        <Skeleton variant="circle">
          <Avatar variant="circle" />
        </Skeleton>
      </ListItemAvatar>

      <ListItemText>
        <Skeleton variant="text"></Skeleton>
      </ListItemText>
    </ListItem>
  );
  let items = item;

  if (quantity) {
    items = new Array(quantity);
    for (let i = 0; i < quantity; i++) {
      items.push({ ...item, key: uniqueId('a&t_skeleton_') });
    }
  }
  return items;
}
