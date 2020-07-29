import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import CreatedBy from './CreatedBy';

import api from '../../../actions/api';
import { ROUTES, goTo, formatRoute } from '../../../actions/goTo';

import { useTranslation } from 'react-i18next';

import styles from './Create.module.css';

import { Paper, Button, Container } from '../../Custom';
import { TextField, CardActions, CardContent } from '../../MUI';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { useQuery, useApiRoute } from '../../../hooks/queries';
import LoadingSpinner from '../LoadingSpinner';
import { useFormInput } from '../../../hooks/forms';

export default function EntityCreate() {
  const { id, type, route } = useQuery();

  const { t } = useTranslation();

  const name = useFormInput('');
  const surname = useFormInput('');

  const [error, setError] = useState(null);
  const [surnameError, setSurnameError] = useState(null);

  const titleDictionary = useMemo(
    () => ({
      [GLOBAL_ENUM.ORGANIZATION]: t('create_organization'),
      [GLOBAL_ENUM.TEAM]: t('create_team'),
      [GLOBAL_ENUM.PERSON]: t('create_person'),
      [GLOBAL_ENUM.EVENT]: t('create_event'),
    }),
    [],
  );

  const entityObject = useMemo(
    () => ({ title: titleDictionary[type] }),
    [type],
  );

  const { response: creator } = useApiRoute(
    formatRoute('/api/entity', null, { id }),
  );

  const validate = values => {
    const errors = {};
    if (!values.name) {
      errors.name = t('name_is_required');
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { name, surname } = values;
      if (error || surnameError) {
        return;
      }
      setIsLoading(true);
      try {
        const res = await api('/api/entity', {
          method: 'POST',
          body: JSON.stringify({
            name,
            surname,
            type,
            creator: id,
          }),
        });
        if (route) {
          goTo(
            ROUTES.eventRegistration,
            {
              id: route,
            },
            {
              teamId: res.data.id,
            },
          );
          setIsLoading(false);
        } else {
          goTo(ROUTES.entity, { id: res.data.id });
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        formik.setFieldError('name', t('something_went_wrong'));
        throw err;
      }
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    history.back();
  };

  const handleChange = value => {
    if (value.length > 64) {
      setError(t('max_length'));
    } else {
      setError(null);
      name.onChange(value);
    }
  };

  const handleSurnameChange = value => {
    if (value.length > 64) {
      setSurnameError(t('max_length'));
    } else {
      setSurnameError(null);
      surname.onChange(value);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <div className={styles.main}>
        <form onSubmit={formik.handleSubmit}>
          <Paper className={styles.card} title={entityObject.title}>
            <CreatedBy {...creator} />
            <CardContent>
              <TextField
                namespace="name"
                label={t('name')}
                formik={formik}
                type="name"
                fullWidth
                disabled={isLoading}
                onChange={handleChange}
                error={error}
                value={name.value}
              />
              <TextField
                hidden={Number(type) !== GLOBAL_ENUM.PERSON}
                namespace="surname"
                label={t('surname')}
                formik={formik}
                type="name"
                fullWidth
                disabled={isLoading}
                onChange={handleSurnameChange}
                error={surnameError}
                value={surname.value}
              />
            </CardContent>
            <CardActions className={styles.buttons}>
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  className={styles.button}
                  type="submit"
                  endIcon="Check"
                >
                  {t('done')}
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  className={styles.button}
                  endIcon="Close"
                  onClick={handleCancel}
                >
                  {t('cancel')}
                </Button>
              </>
            </CardActions>
          </Paper>
        </form>
      </div>
    </Container>
  );
}
