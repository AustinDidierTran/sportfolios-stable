import React from 'react';
import { TableCell } from '../../../../MUI';
import { Button, IconButton } from '../../../../Custom';
import { goTo } from '../../../../../actions/goTo';
import Switch from '@material-ui/core/Switch';

export default function TableFactory(props) {
  const { d, h } = props;

  if (h.type === 'button') {
    return (
      <TableCell>
        <Button
          className={styles.button}
          onClick={() => {
            goTo(d.buttonRoute, d.id);
          }}
        >
          {d[h.value]}
        </Button>
      </TableCell>
    );
  }

  if (h.type === 'toggle') {
    return (
      <TableCell>
        <Switch
          name={d.name}
          checked={d.isChecked}
          onChange={d.handleChange}
          inputProps={d.inputProps}
          color={d.color}
        ></Switch>
      </TableCell>
    );
  }
  if (h.type === 'iconButton') {
    return (
      <TableCell>
        <IconButton
          onClick={d.onIconButtonClick}
          icon={d.icon}
          style={{ color: 'primary' }}
        />
      </TableCell>
    );
  }
  return <TableCell>{d[h.value]}</TableCell>;
}
