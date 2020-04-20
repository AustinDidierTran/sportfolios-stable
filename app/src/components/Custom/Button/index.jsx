import React from 'react';

import { Button } from '../../MUI';
import { Icon } from '../../Custom';

import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import NavigateNext from '@material-ui/icons/NavigateNext';

export default function CustomButton(props) {
  const icons = {
    Check,
    Close,
    Edit,
    NavigateNext,
  };

  return (
    <Button
      size="small"
      color="primary"
      variant="contained"
      {...props}
      endIcon={<Icon icon={props.endIcon} />}
    />
  );
}
