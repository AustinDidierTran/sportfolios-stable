import React from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '../../../MUI';

export default function ViewTable(props) {
  const { data, headers, title } = props;

  return (
    <>
      <Typography gutterBottom variant="h5" component="h2">{title}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((h, index) => <TableCell key={index}>{h.display}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d, index) =>
            <TableRow key={index}>
              {headers.map((h, index) => <TableCell key={index}>{d[h.value]}</TableCell>)}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}