import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '../../../MUI';

import CreateRow from './CreateRow';
import DataRow from './DataRow';

export default function EditTable(props) {
  const { allowCreate, data, headers, onCreate, title, validationSchema } = props;

  return (
    <>
      <Typography gutterBottom variant="h5" component="h2">{title}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((h, index) => <TableCell key={index}>{h.display}</TableCell>)}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d, index) =>
            <DataRow datum={d} headers={headers} key={index} />
          )}
          <CreateRow
            allowCreate={allowCreate}
            headers={headers}
            onCreate={onCreate}
            validationSchema={validationSchema}
          />
        </TableBody>
      </Table>
    </>
  )
}