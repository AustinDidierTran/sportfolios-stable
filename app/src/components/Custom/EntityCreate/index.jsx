import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import CreatedBy from './CreatedBy';

import CircularProgress from '@material-ui/core/CircularProgress';
import api from '../../../actions/api';
import { ROUTES, goTo, formatRoute } from '../../../actions/goTo';

import { useTranslation } from 'react-i18next';

import styles from './Create.module.css';

import { Paper, Button, Container } from '../../Custom';
import { TextField, CardActions, CardContent } from '../../MUI';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { useQuery, useApiRoute } from '../../../hooks/queries';

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

  const { response: owner } = useApiRoute(
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
      setIsLoading(true);
      try {
        const res = await api('/api/entity', {
          method: 'POST',
          body: JSON.stringify({
            name,
            surname,
            type,
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

  return (
    <Container>
      <div className={styles.main}>
        <form onSubmit={formik.handleSubmit}>
          <Paper className={styles.card} title={entityObject.title}>
            <CreatedBy {...owner} />
            {isLoading ? (
              <>
                <CardContent>
                  <TextField
                    namespace="name"
                    label={t('name')}
                    fullWidth
                    disabled
                  />
                  <TextField
                    hidden={type !== GLOBAL_ENUM.PERSON}
                    namespace="surname"
                    label={t('surname')}
                    fullWidth
                    disabled
                  />
                </CardContent>
                <div className={styles.div}>
                  <CircularProgress className={styles.progress} />
                </div>
              </>
            ) : (
              <>
                <CardContent>
                  <TextField
                    namespace="name"
                    label={t('name')}
                    formik={formik}
                    type="name"
                    fullWidth
                  />
                  <TextField
                    hidden={type !== GLOBAL_ENUM.PERSON}
                    namespace="surname"
                    label={t('surname')}
                    formik={formik}
                    type="name"
                    fullWidth
                  />
                </CardContent>
                <CardActions className={styles.buttons}>
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
                </CardActions>
              </>
            )}
          </Paper>
        </form>
      </div>
    </Container>
  );
}
