import React, { useState, useContext, useEffect } from 'react';
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
import BasicFormDialog from '../BasicFormDialog';
import moment from 'moment';
import { useQuery } from '../../../../hooks/queries';
import { getMembershipName } from '../../../../utils/stringFormats';
import LoadingSpinner from '../../LoadingSpinner';

export default function EditMembership(props) {
  const {
    open: openProps,
    onClose,
    update,
    person,
    membership,
    expirationDate,
  } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: entityId } = useQuery();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = values => {
    const { expirationDate } = values;
    const errors = {};
    if (!expirationDate) {
      errors.expirationDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      expirationDate: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      setIsLoading(true);
      const { expirationDate } = values;
      const res = await api(`/api/entity/memberManually`, {
        method: 'POST',
        body: JSON.stringify({
          membershipType: membership,
          organizationId: entityId,
          personId: person.id,
          expirationDate: new Date(expirationDate),
        }),
      });

      if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('membership_edited'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        update();
        handleClose();
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  useEffect(() => {
    formik.setFieldValue(
      'expirationDate',
      moment(expirationDate).format('YYYY-MM-DD'),
    );
  }, [expirationDate]);

  const handleClose = () => {
    onClose();
  };

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: `${person?.name} ${person?.surname}`,
      secondary: t(getMembershipName(membership)),
    },
    {
      namespace: 'expirationDate',
      label: t('expiration_date'),
      type: 'date',
      shrink: true,
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

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <BasicFormDialog
      open={open}
      title={t('edit_membership')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
