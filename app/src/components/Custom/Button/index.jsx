import React from 'react';

import { Button } from '../../MUI';

import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';

export default function CustomButton(props) {
  const icons = {
    Check,
    Close,
    Edit,
  };

  const EndIcon = icons[props.endIcon];

  return (
    <Button
      size="small"
      color="primary"
      variant="contained"
      {...props}
      endIcon={<EndIcon />}
    />
  );
}
