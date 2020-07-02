import React from 'react';

import { TableRow, TableCell } from '../../../../components/MUI';

import { useFormInput } from '../../../../../src/hooks/forms';

import IconButton from '../../../../components/Custom/IconButton';

// Buttons
import { useEffect } from 'react';

export default function DataRow(props) {
  const { datum, headers, onDelete, index } = props;

  let values = headers.reduce(
    (prev, h) => ({
      ...prev,
      [h.value]: useFormInput(datum[h.value] || ''),
    }),
    {},
  );

  useEffect(() => {
    Object.keys(values).forEach(key =>
      values[key].changeDefault(datum[key]),
    );
  }, [datum]);
  return (
    <TableRow>
      {headers.map((h, index) => (
        <>
          {h.value === 3 ? (
            <TableCell key={index}>{`${datum[h.value] /
              100}$`}</TableCell>
          ) : (
            <TableCell key={index}>{datum[h.value]}</TableCell>
          )}
        </>
      ))}
      <TableCell>
        <IconButton
          icon="Delete"
          onClick={() => {
            onDelete(index);
          }}
          tooltip="Delete"
        />
      </TableCell>
    </TableRow>
  );
}
