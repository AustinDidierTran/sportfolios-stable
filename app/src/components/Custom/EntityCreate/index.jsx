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

export default function EntityCreate() {
  const { id, type } = useQuery();

  const { t } = useTranslation();

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
    const { name, surname } = values;
    if (!name) {
      errors.name = t('name_is_required');
    } else {
      if (name.length > 64) {
        formik.setFieldValue('name', name.slice(0, 64));
      }
    }
    if (surname && surname.length > 64) {
      formik.setFieldValue('surname', surname.slice(0, 64));
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
    onSubmit: async values => {
      const { name, surname } = values;
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
        goTo(ROUTES.entity, { id: res.data.id });
        setIsLoading(false);
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
              />
              <TextField
                hidden={Number(type) !== GLOBAL_ENUM.PERSON}
                namespace="surname"
                label={t('surname')}
                formik={formik}
                type="name"
                fullWidth
                disabled={isLoading}
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
