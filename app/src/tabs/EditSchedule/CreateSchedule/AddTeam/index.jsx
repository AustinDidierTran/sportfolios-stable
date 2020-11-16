import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  GLOBAL_ENUM,
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../common/enums';
import { useParams } from 'react-router-dom';

export default function AddTeam(props) {
  const { t } = useTranslation();
  const { isOpen, onClose } = props;
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    const { name } = values;
    const errors = {};
    if (!name.length) {
      errors.name = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (name.length > 64) {
      formik.setFieldValue('name', name.slice(0, 64));
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validate,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { name } = values;
      const {
        data: { basicInfos: team },
      } = await api('/api/entity', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          type: GLOBAL_ENUM.TEAM,
        }),
      });
      const { data } = await api('/api/entity/register', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          teamId: team.id,
        }),
      });
      const res = await api('/api/entity/addTeamToSchedule', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          name,
          rosterId: data.rosterId,
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
          message: t('team_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
      }
    },
  });

  const buttons = [
    {
      onClick: onFinish,
      name: t('finish'),
      color: 'grey',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'name',
      id: 'name',
      type: 'text',
      label: t('name'),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('add_team')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
