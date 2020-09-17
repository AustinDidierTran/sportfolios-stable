import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '../../../MUI';
import { Button } from '../../../Custom';
import styles from './ViewTable.module.css';
import { goTo } from '../../../../actions/goTo';

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
                <>
                  {h.type === 'button' ? (
                    <TableCell key={index}>
                      <Button
                        className={styles.button}
                        onClick={() => {
                          goTo(d.buttonRoute, d.id);
                        }}
                      >
                        {d[h.value]}
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell key={index}>{d[h.value]}</TableCell>
                  )}
                </>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
