import React from 'react';
import { CSVLink } from 'react-csv';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../Custom';

export default function DownloadReportDialog(props) {
  const { t } = useTranslation();
  const { open, title, data, headers, onClose, fileName } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{title}</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <CSVLink
            data={data}
            headers={headers}
            onClick={onClose}
            style={{ textDecoration: 'none' }}
            filename={fileName}
          >
            <Button color="primary">{t('download')}</Button>
          </CSVLink>
          <Button onClick={onClose} color="secondary">
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
