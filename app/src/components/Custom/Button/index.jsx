import React from 'react';

import { Button } from '../../MUI';
import { Icon } from '../../Custom';

export default function CustomButton(props) {
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
