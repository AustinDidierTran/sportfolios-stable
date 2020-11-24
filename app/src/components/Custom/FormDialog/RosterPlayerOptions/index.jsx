import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  COMPONENT_TYPE_ENUM,
  ROSTER_ROLE_ENUM,
} from '../../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';

export default function RosterPlayersOptions(props) {
  const { t } = useTranslation();
  const {
    open: openProps,
    onClose,
    onPlayerRemove,
    onRoleUpdate,
    player,
  } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openProps);
    formik.setFieldValue(
      'role',
      player.role ? player.role : ROSTER_ROLE_ENUM.PLAYER,
    );
  }, [openProps]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const onShouldRemoveChange = value => {
    formik.setFieldValue('shouldRemove', value);
  };

  const formik = useFormik({
    initialValues: {
      role: '',
      shouldRemove: false,
    },
    onSubmit: async values => {
      const { role, shouldRemove } = values;

      if (shouldRemove) {
        onPlayerRemove(player.id);
      } else {
        onRoleUpdate(role, player.id);
      }
    },
  });

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'role',
      label:
        formik.values.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN
          ? t('assistant_captain')
          : t('role'),
      options: [
        {
          display: t('coach'),
          value: ROSTER_ROLE_ENUM.COACH,
        },
        {
          display: t('captain'),
          value: ROSTER_ROLE_ENUM.CAPTAIN,
        },
        {
          display: t('assistant_captain'),
          value: ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN,
        },
        {
          display: t('player'),
          value: ROSTER_ROLE_ENUM.PLAYER,
        },
      ],
    },
    {
      componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
      namespace: 'remove',
      label: t('remove_from_roster'),
      checked: formik.values.shouldRemove,
      onChange: onShouldRemoveChange,
      color: 'primary',
    },
  ];

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('edit'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('edit_player')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
