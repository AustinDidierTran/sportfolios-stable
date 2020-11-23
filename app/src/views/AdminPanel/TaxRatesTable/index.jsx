import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  Button,
  FormDialog,
  LoadingSpinner,
  Table,
} from '../../../components/Custom';
import { CardContent } from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import styles from './TaxRatesTable.module.css';
import api from '../../../actions/api';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../../common/enums';
import { formatRoute } from '../../../actions/goTo';

export default function TaxeRatesTable() {
  const { t } = useTranslation();
  const [taxes, setTaxes] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);

  const updateTax = async (taxRateId, active) => {
    setIsLoading(true);
    await api('/api/admin/updateActiveStatusTaxRate', {
      method: 'PUT',
      body: JSON.stringify({
        taxRateId,
        active: !active,
      }),
    });
    getTaxes();
    setIsLoading(false);
  };

  const onDelete = async taxRateId => {
    setDeletingId(taxRateId);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (deletingId) {
      await api(
        formatRoute('/api/admin/deleteTaxRate', null, {
          taxRateId: deletingId,
        }),
        {
          method: 'DELETE',
        },
      );
      getTaxes();
    }
    setOpenDelete(false);
    setIsLoading(false);
  };

  const getTaxes = async () => {
    const res = await api('/api/admin/taxRates');
    const arr = res.data.map(d => ({
      isChecked: d.active,
      handleChange: () => {
        updateTax(d.id, d.active);
      },
      color: 'primary',
      tax: d.display_name,
      description: d.description,
      percentage: `${d.percentage} %`,
      inclusive: t(d.inclusive.toString()),
      onIconButtonClick: () => {
        onDelete(d.id);
      },
      icon: 'Delete',
    }));
    setTaxes(arr);
  };

  useEffect(() => {
    getTaxes();
  }, []);

  const headers = [
    { display: t('tax'), value: 'tax' },
    { display: t('description'), value: 'description' },
    { display: t('percentage'), value: 'percentage' },
    { display: t('inclusive'), value: 'inclusive' },
    {
      display: t('active'),
      type: 'toggle',
    },
    { display: t('delete'), type: 'iconButton', value: 'delete' },
  ];

  const onClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  return (
    <Paper className={styles.card}>
      <CardContent className={styles.inputs}>
        <Table title={t('taxes')} headers={headers} data={taxes} />
        <Button
          style={{ margin: '8px' }}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t('add_tax')}
        </Button>
      </CardContent>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.CREATE_TAX_RATE}
        items={{
          open,
          onClose,
          update: getTaxes,
        }}
      />
      <AlertDialog
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
        }}
        onSubmit={handleDelete}
        title={t('delete_tax_confirmation')}
      />
    </Paper>
  );
}
