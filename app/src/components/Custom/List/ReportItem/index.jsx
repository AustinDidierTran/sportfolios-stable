import React, { useContext, useMemo, useState } from 'react';

import { ListItem, ListItemText } from '../../../MUI';
import { DownloadReportDialog } from '../../../Custom';

import { useTranslation } from 'react-i18next';
import styles from './ReportItem.module.css';
import { formatDate } from '../../../../utils/stringFormats';
import { IconButton } from '../..';
import { Divider } from '@material-ui/core';
import { AlertDialog } from '../../Dialog';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import {
  INVOICE_STATUS_ENUM,
  REPORT_TYPE_ENUM,
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../common/enums';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../../common/errors';
import { getMembershipName } from '../../../../../../common/functions';

export default function ReportItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { metadata, reportType, reportId, update } = props;
  const [openDelete, setOpenDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

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

  const getStatusName = status => {
    if (status === INVOICE_STATUS_ENUM.OPEN) {
      return t('not_paid');
    } else if (status === INVOICE_STATUS_ENUM.PAID) {
      return t('paid');
    }
    return '';
  };

  const handleClick = async () => {
    const res = await api(
      formatRoute('/api/entity/generateReport', null, { reportId }),
    );
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      const data = res.data.data;
      const formattedData = data.map(d => ({
        name: d.name,
        surname: d.surname,
        membership: t(getMembershipName(d.memberType)),
        price: d.price,
        status: t(getStatusName(d.status)),
        paidOn: formatDate(moment(d.paidOn), 'YYYY-MM-DD'),
        createdAt: formatDate(moment(d.createdAt), 'YYYY-MM-DD'),
        expirationDate: formatDate(
          moment(d.expirationDate),
          'YYYY-MM-DD',
        ),
        email: d.email,
        birthDate: d.birthDate,
        gender: t(d.gender),
        city: d.city,
        state: d.state,
        zip: d.zip,
      }));
      setData(formattedData);
      setOpen(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  const reportName = useMemo(() => {
    if (reportType === REPORT_TYPE_ENUM.MEMBERS_WITH_DATE) {
      return `${t('members_list_on')} ${formatDate(
        moment(metadata.date),
      )}`;
    }
    return '';
  }, []);

  const headers = useMemo(() => {
    if (reportType === REPORT_TYPE_ENUM.MEMBERS_WITH_DATE) {
      return [
        { label: t('name'), key: 'name' },
        { label: t('surname'), key: 'surname' },
        { label: t('membership'), key: 'membership' },
        { label: t('price'), key: 'price' },
        { label: t('status'), key: 'status' },
        { label: t('payment_date'), key: 'paidOn' },
        { label: t('creation_date'), key: 'createdAt' },
        { label: t('expiration_date'), key: 'expirationDate' },
        { label: t('email'), key: 'email' },
        { label: t('birth_date'), key: 'birthDate' },
        { label: t('gender'), key: 'gender' },
        { label: t('city'), key: 'city' },
        { label: t('state'), key: 'state' },
        { label: t('zip_code'), key: 'zip' },
      ];
    }
  }, []);

  const fileName = useMemo(() => {
    if (reportType === REPORT_TYPE_ENUM.MEMBERS_WITH_DATE) {
      const { date, organizationName } = metadata;
      return `${organizationName} ${t('members')} ${formatDate(
        moment(date),
        'YYYY-MM-DD',
      )}.csv`;
    }
    return `${t('report')}`;
  }, []);

  return (
    <>
      <ListItem style={{ width: '100%' }} className={styles.listItem}>
        <ListItemText
          className={styles.item1}
          primary={reportName}
        ></ListItemText>
        <IconButton
          variant="contained"
          icon="GetApp"
          tooltip={t('download_report')}
          style={{ color: 'primary', margin: '8px' }}
          onClick={handleClick}
        />
        <IconButton
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
        <DownloadReportDialog
          fileName={fileName}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          title={t('download_report')}
          data={data}
          headers={headers}
        />
      </ListItem>
      <Divider />
    </>
  );
}
