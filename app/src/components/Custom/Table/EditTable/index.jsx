import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '../../../MUI';

import CreateRow from './CreateRow';
import DataRow from './DataRow';

export default function EditTable(props) {
  const { t } = useTranslation();
  const {
    onDelete,
    allowCreate,
    data,
    headers,
    onCreate,
    onEdit,
    title,
    validationSchema,
  } = props;

  return (
    <>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((h, index) => (
              <TableCell key={index}>{h.display}</TableCell>
            ))}
            <TableCell>{t('actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d, index) => (
            <DataRow
              datum={d}
              onDelete={onDelete}
              index={index}
              headers={headers}
              onEdit={onEdit}
              key={d.id}
            />
          ))}
          <CreateRow
            allowCreate={allowCreate}
            headers={headers}
            onCreate={onCreate}
            validationSchema={validationSchema}
          />
        </TableBody>
      </Table>
    </>
  );
}
