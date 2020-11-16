import React, { useState } from 'react';

import { ListItem, ListItemText } from '../../../MUI';

import { useTranslation } from 'react-i18next';
import styles from './ReportItem.module.css';
import { formatDate } from '../../../../utils/stringFormats';
import { IconButton } from '../..';
import { Divider } from '@material-ui/core';
import { AlertDialog } from '../../Dialog';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { REPORT_TYPE_ENUM } from '../../../../../../common/enums';
import moment from 'moment';

export default function ReportItem(props) {
  const { t } = useTranslation();

  const { metadata, reportType, reportId, update } = props;
  const [openDelete, setOpenDelete] = useState(false);

  const onCancel = () => {
    setOpenDelete(false);
  };

  const onDelete = () => {
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    await api(
      formatRoute('/api/entity/report', null, {
        reportId,
      }),
      {
        method: 'DELETE',
      },
    );
    setOpenDelete(false);
    update();
  };

  const exportReport = () => {};

  const getReportName = () => {
    if (reportType === REPORT_TYPE_ENUM.MEMBERS_WITH_DATE) {
      const { date } = metadata;
      return `${t('members_list_on')} ${formatDate(moment(date))}`;
    } else {
      return '';
    }
  };

  return (
    <>
      <ListItem style={{ width: '100%' }} className={styles.listItem}>
        <ListItemText
          className={styles.item1}
          primary={getReportName(reportType, metadata)}
        ></ListItemText>
        <IconButton
          className={styles.iconButton}
          variant="contained"
          icon="GetApp"
          tooltip={t('download_report')}
          onClick={exportReport}
          style={{ color: 'primary', margin: '8px' }}
        />
        <IconButton
          className={styles.iconButton}
          variant="contained"
          icon="Delete"
          tooltip={t('delete')}
          onClick={onDelete}
          style={{ color: 'primary' }}
        />
        <AlertDialog
          open={openDelete}
          onCancel={onCancel}
          onSubmit={confirmDelete}
          title={t('delete_report_confirmation')}
        />
      </ListItem>
      <Divider />
    </>
  );
}
