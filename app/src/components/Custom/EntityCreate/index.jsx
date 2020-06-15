import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';

import CircularProgress from '@material-ui/core/CircularProgress';
import api from '../../../actions/api';
import { ROUTES, goTo } from '../../../actions/goTo';

import { useTranslation } from 'react-i18next';

import styles from './Create.module.css';

import { Container, Paper, Button } from '../../Custom';
import {
  TextField,
  Typography,
  CardActions,
  CardContent,
} from '../../MUI';
import { ENTITIES_TYPE_ENUM } from '../../../views/Entity';

export default function EntityCreate(props) {
  const { type } = props;
  const { t } = useTranslation();

  const entityObject = useMemo(() => {
    console.log('type', type);
    console.log('ENTITIES_TYPE_ENUM', ENTITIES_TYPE_ENUM);

    if (type === ENTITIES_TYPE_ENUM.ORGANIZATION) {
      return {
        title: t('create_organization'),
      };
    }
    if (type === ENTITIES_TYPE_ENUM.TEAM) {
      return {
        title: t('create_team'),
      };
    }
  }, [type]);

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
      const { name } = values;
      setIsLoading(true);
      try {
        const res = await api('/api/entity', {
          method: 'POST',
          body: JSON.stringify({
            name,
            type,
          }),
        });
        goTo(ROUTES.entity, { id: res.data.id });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        throw err;
      }
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    history.back();
  };

  return (
    <div className={styles.main}>
      <form onSubmit={formik.handleSubmit}>
        <Container>
          <Paper className={styles.card}>
            {isLoading ? (
              <>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                  >
                    {entityObject.title}
                  </Typography>
                  <TextField
                    namespace="name"
                    label={t('name')}
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
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                  >
                    {entityObject.title}
                  </Typography>
                  <TextField
                    namespace="name"
                    label={t('name')}
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
        </Container>
      </form>
    </div>
  );
}
