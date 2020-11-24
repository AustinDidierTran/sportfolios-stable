import React, { useContext, useState } from 'react';
import { ListItem, ListItemText } from '../../../../MUI';
import { DownloadReportDialog, IconButton } from '../../..';
import { useTranslation } from 'react-i18next';
import {
  formatDate,
  formatPrice,
} from '../../../../../utils/stringFormats';
import { Divider } from '@material-ui/core';
import api from '../../../../../actions/api';
import { formatRoute } from '../../../../../actions/goTo';
import {
  INVOICE_STATUS_ENUM,
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../../common/enums';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../../Store';
import { ERROR_ENUM } from '../../../../../../../common/errors';
import { getMembershipName } from '../../../../../../../common/functions';
import { AlertDialog } from '../../../Dialog';

export default function MembersReportItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { metadata, update, reportId } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
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

  const getStatusName = status => {
    switch (status) {
      case INVOICE_STATUS_ENUM.OPEN:
        return t('not_paid');
      case INVOICE_STATUS_ENUM.PAID:
        return t('paid');
      default:
        return '';
    }
  };

  const handleClick = async () => {
    const res = await api(
      formatRoute('/api/entity/generateReport', null, { reportId }),
    );
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      const formattedData = res.data.map(d => ({
        name: d.name,
        surname: d.surname,
        membership: t(getMembershipName(d.member_type)),
        price: formatPrice(d.price),
        status: t(getStatusName(d.status)),
        paidOn: formatDate(moment(d.paid_on), 'YYYY-MM-DD HH:mm'),
        createdAt: formatDate(
          moment(d.created_at),
          'YYYY-MM-DD HH:mm',
        ),
        expirationDate: formatDate(
          moment(d.expiration_date),
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

  const reportName = `${t('members_list_on')} ${formatDate(
    moment(metadata.date),
  )}`;

  const headers = [
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

  const fileName = `${metadata.organizationName} ${t(
    'members',
  )} ${formatDate(moment(metadata.date), 'YYYY-MM-DD')}.csv`;

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <ListItemText primary={reportName}></ListItemText>
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
