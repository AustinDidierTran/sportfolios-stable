import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '../../../MUI';
import TableFactory from './TableFactory';
import styles from './ViewTable.module.css';

export default function ViewTable(props) {
  const { data, description, headers, onRowClick, title } = props;
  return (
    <>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      <Table className={styles.table}>
        <TableHead>
          {description ? (
            <TableRow>
              <TableCell>{description}</TableCell>
            </TableRow>
          ) : (
            <></>
          )}
          <TableRow>
            {headers.map((h, index) => (
              <TableCell key={index}>{h.display}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d, index) => (
            <TableRow
              key={index}
              onClick={onRowClick && onRowClick(d)}
            >
              {headers.map((h, index) => (
                <TableFactory d={d} h={h} key={index} />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
