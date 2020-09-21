import React, { useState, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  COMPONENT_TYPE_ENUM,
} from '../../../../../../common/enums';
import { useEffect } from 'react';

export default function AddSub(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { open: openProps, rosterId, onClose, updateRoster } = props;
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const onChange = value => {
    setIsChecked(value);
  };

  const validate = values => {
    const { player } = values;
    const errors = {};
    if (!player.length) {
      errors.player = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      player: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { player } = values;
      const res = await api('/api/entity/addPlayerToRoster', {
        method: 'POST',
        body: JSON.stringify({
          name: player,
          isSub: isChecked,
          rosterId,
        }),
      });

      resetForm();
      if (res.status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('sub_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        onClose();
        updateRoster(player);
      }
    },
  });

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('done'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'player',
      label: t('player_name'),
      type: 'text',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
      name: 'isSub',
      label: t('is_sub'),
      checked: isChecked,
      onChange: onChange,
      color: 'primary',
    },
  ];

  return (
    <>
      <FormDialog
        open={open}
        title={t('add_player')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={onClose}
      />
    </>
  );
}
