import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  COMPONENT_TYPE_ENUM,
  MEMBERSHIP_TYPE_ENUM,
} from '../../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import moment from 'moment';
import { useQuery } from '../../../../hooks/queries';
import { IconButton } from '../..';

export default function AddMember(props) {
  const { open: openProps, onClose } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: entityId } = useQuery();

  const [open, setOpen] = useState(false);
  const [persons, setPersons] = useState([]);

  const validate = values => {
    const { expirationDate } = values;
    const errors = {};
    if (!persons.length) {
      errors.persons = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!expirationDate) {
      errors.expirationDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      membership: '',
      expirationDate: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { membership, expirationDate } = values;
      const res = await Promise.all(
        persons.map(async person => {
          const res = await api(`/api/entity/memberManually`, {
            method: 'POST',
            body: JSON.stringify({
              membershipType: membership,
              organizationId: entityId,
              personId: person.id,
              expirationDate: new Date(expirationDate),
            }),
          });
          return res;
        }),
      );

      if (
        res.some(r => r.status === STATUS_ENUM.ERROR) ||
        res.some(r => r.status >= 400)
      ) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        const message = persons.length
          ? 'members_added'
          : 'member_added';
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t(message),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        update();
        handleClose();
      }
    },
  });

  useEffect(() => {
    setOpen(openProps);
    formik.setFieldValue(
      'membership',
      MEMBERSHIP_TYPE_ENUM.RECREATIONAL,
    );
    formik.setFieldValue(
      'expirationDate',
      moment()
        .add(1, 'year')
        .format('YYYY-MM-DD'),
    );
  }, [openProps]);

  const handleClose = () => {
    setPersons([]);
    onClose();
  };

  const onClick = newPerson => {
    setPersons([...persons, newPerson]);
  };

  const removePerson = person => {
    const newPersons = persons.filter(p => p.id != person.id);
    setPersons(newPersons);
  };
  const personComponent = useMemo(
    () =>
      persons.map(person => ({
        componentType: COMPONENT_TYPE_ENUM.PERSON_ITEM,
        person,
        secondary: t('player'),
        notClickable: true,
        secondaryActions: [
          <IconButton
            icon="Remove"
            style={{ color: 'secondary' }}
            onClick={() => removePerson(person)}
          />,
        ],
      })),
    [persons],
  );

  const blackList = useMemo(() => persons.map(person => person.id), [
    persons,
  ]);

  const fields = [
    ...personComponent,
    {
      componentType: COMPONENT_TYPE_ENUM.PERSON_SEARCH_LIST,
      namespace: 'person',
      label: t('player'),
      blackList,
      onClick,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'membership',
      label: t('membership'),
      options: [
        {
          display: t('recreational'),
          value: MEMBERSHIP_TYPE_ENUM.RECREATIONAL,
        },
        {
          display: t('competitive'),
          value: MEMBERSHIP_TYPE_ENUM.COMPETITIVE,
        },
        {
          display: t('elite'),
          value: MEMBERSHIP_TYPE_ENUM.ELITE,
        },
        {
          display: t('junior'),
          value: MEMBERSHIP_TYPE_ENUM.JUNIOR,
        },
      ],
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
      name: t('add'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('add_membership')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
