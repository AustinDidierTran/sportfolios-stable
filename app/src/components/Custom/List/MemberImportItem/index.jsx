import React, { useState } from 'react';

import { ListItem, ListItemText } from '../../../MUI';
import { FormDialog, Icon } from '../..';

import { useTranslation } from 'react-i18next';
import styles from './MemberImportItem.module.css';
import {
  formatDate,
  getMembershipName,
} from '../../../../utils/stringFormats';
import { IconButton } from '../..';
import moment from 'moment';
import { Divider } from '@material-ui/core';
import {
  FORM_DIALOG_TYPE_ENUM,
  INVOICE_STATUS_ENUM,
} from '../../../../../../common/enums';
import { useQuery } from '../../../../hooks/queries';
import { AlertDialog } from '../../Dialog';
import api from '../../../../actions/api';
import { formatRoute, goTo, ROUTES } from '../../../../actions/goTo';

export default function MemberImportItem(props) {
  const { t } = useTranslation();

  const {
    person,
    memberType,
    expirationDate,
    update,
    status,
  } = props;
  const { id: entityId } = useQuery();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const onCancel = () => {
    setOpenDelete(false);
  };

  const onDelete = () => {
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    await api(
      formatRoute('/api/entity/member', null, {
        memberType,
        organizationId: entityId,
        personId: person.id,
      }),
      {
        method: 'DELETE',
      },
    );
    setOpenDelete(false);
    update();
  };

  return (
    <>
      <ListItem
        style={{ width: '100%' }}
        className={styles.listItem}
        button
      >
        <ListItemText
          className={styles.item1}
          primary={`${person?.name} ${person?.surname}`}
          onClick={() => {
            goTo(ROUTES.entity, { id: person.id });
          }}
        ></ListItemText>
        {moment(expirationDate) < moment() ? (
          <ListItemText
            secondaryTypographyProps={{ color: 'secondary' }}
            className={styles.item2}
            primary={t(getMembershipName(memberType))}
            secondary={`${t('expired_on')}
              ${formatDate(moment(expirationDate))}`}
            onClick={() => {
              goTo(ROUTES.entity, { id: person.id });
            }}
          ></ListItemText>
        ) : (
          <ListItemText
            className={styles.item2}
            primary={t(getMembershipName(memberType))}
            secondary={`${t('valid_until')}
              ${formatDate(moment(expirationDate))}`}
            onClick={() => {
              goTo(ROUTES.entity, { id: person.id });
            }}
          ></ListItemText>
        )}
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP}
          items={{
            open,
            onClose,
            update,
            membership: memberType,
            person,
            expirationDate,
          }}
        />
        {status === INVOICE_STATUS_ENUM.PAID ||
        status === INVOICE_STATUS_ENUM.FREE ? (
          <Icon icon="AttachMoney" color="green" />
        ) : (
          <Icon icon="MoneyOff" color="red" />
        )}
        <IconButton
          className={styles.iconButton}
          variant="contained"
          icon="Edit"
          tooltip={t('edit')}
          onClick={onOpen}
          style={{ color: 'primary' }}
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
          title={t('delete_member_confirmation')}
        />
      </ListItem>
      <Divider />
    </>
  );
}
