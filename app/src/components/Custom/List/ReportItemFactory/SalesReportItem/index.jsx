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
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../../common/enums';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../../Store';
import { ERROR_ENUM } from '../../../../../../../common/errors';
import { AlertDialog } from '../../../Dialog';
import {
  getProductDetail,
  getProductName,
} from '../../../../../utils/Cart';

export default function ReportItem(props) {
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

  const handleClick = async () => {
    const res = await api(
      formatRoute('/api/entity/generateReport', null, { reportId }),
    );
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      const formattedData = res.data.map(d => ({
        type: t(getProductName(d.metadata.type)),
        detail: getProductDetail(d.metadata),
        name: d.person.name,
        surname: d.person.surname,
        email: d.email,
        price: formatPrice(d.unit_amount),
        quantity: d.quantity,
        total: formatPrice(d.amount),
        purchasedOn: formatDate(
          moment(d.created_at),
          'YYYY-MM-DD HH:mm',
        ),
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
  const reportName = `${t('sales_on')} ${formatDate(
    moment(metadata.date),
  )}`;

  const headers = [
    { label: t('type'), key: 'type' },
    { label: t('product_detail'), key: 'detail' },
    { label: t('buyers_name'), key: 'name' },
    { label: t('surname'), key: 'surname' },
    { label: t('email'), key: 'email' },
    { label: t('price'), key: 'price' },
    { label: t('quantity'), key: 'quantity' },
    { label: t('total'), key: 'total' },
    { label: t('purchased_on'), key: 'purchasedOn' },
  ];

  const fileName = `${metadata.organizationName} ${t(
    'sales',
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
      </ListItem>
      <AlertDialog
        open={openDelete}
        onCancel={onCancel}
        onSubmit={confirmDelete}
        title={t('delete_report_confirmation')}
      />
      <Divider />
    </>
  );
}
