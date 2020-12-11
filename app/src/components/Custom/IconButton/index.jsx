import React from 'react';

import { Tooltip } from '@material-ui/core';

import { Icon } from '../../Custom';
import { Badge, IconButton } from '../../MUI';

export default function CustomIconButton(props) {
  const {
    icon = 'Add',
    onClick = () => {},
    size = 'small',
    tooltip = '',
    fontSize = 'default',

    // badge props
    withBadge = false,
    badgeColor = 'secondary',
    badgeContent = 0,

    ...otherProps
  } = props;

  return (
    <Tooltip title={tooltip}>
      <div>
        <IconButton
          size={size}
          onClick={onClick}
          {...otherProps}
          style={{ color: '#fff', ...props.style }}
        >
          <Badge
            invisible={!withBadge || !badgeContent}
            badgeContent={badgeContent}
            color={badgeColor}
          >
            <Icon icon={icon} fontSize={fontSize} />
          </Badge>
        </IconButton>
      </div>
    </Tooltip>
  );
}
