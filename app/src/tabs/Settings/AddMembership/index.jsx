import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  Button,
  FormDialog,
  Paper,
} from '../../../components/Custom';
import {
  getMembershipName,
  getMembershipType,
  getExpirationDate,
} from '../../../utils/stringFormats';
import {
  FORM_DIALOG_TYPE_ENUM,
  LIST_ITEM_ENUM,
} from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import { List } from '../../../components/Custom';

export default function AddMembership() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  const { id } = useParams();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    getMemberships();
  }, [id]);

  const getMemberships = async () => {
    const res = await api(`/api/entity/memberships/?id=${id}`);
    const data = res.data.map(d => ({
      membership: t(getMembershipName(d.membership_type)),
      membershipType: t(getMembershipType(d.length, d.fixed_date)),
      expirationDate: getExpirationDate(d.length, d.fixed_date),
      price: d.price,
      type: LIST_ITEM_ENUM.MEMBERSHIP_ORGANIZATION,
      id: d.id,
      onDelete,
      key: d.id,
    }));
    setOptions(data);
  };

  const onDelete = id => {
    setDeletedId(id);
    setAlertDialog(true);
  };

  const deleteConfirmed = async () => {
    closeAlertDialog();
    await api(
      formatRoute('/api/entity/membership', null, {
        membershipId: deletedId,
      }),
      {
        method: 'DELETE',
      },
    );
    getMemberships();
  };

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const update = () => {
    getMemberships();
  };
  const closeAlertDialog = () => {
    setAlertDialog(false);
  };

  return (
    <Paper title={t('memberships')}>
      <Button
        size="small"
        variant="contained"
        style={{ margin: '8px' }}
        onClick={onOpen}
      >
        {t('add_membership')}
      </Button>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP}
        items={{
          open,
          onClose,
          update,
        }}
      />
      <AlertDialog
        open={alertDialog}
        onSubmit={deleteConfirmed}
        onCancel={closeAlertDialog}
        description={t('delete_membership_confirmation')}
        title={t('delete_membership')}
      />
      <List items={options} />
    </Paper>
  );
}
