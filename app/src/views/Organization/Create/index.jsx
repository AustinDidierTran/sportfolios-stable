import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Store } from '../../../Store';
import api from '../../../actions/api';
import { ROUTES, goTo } from '../../../actions/goTo';

import { useTranslation } from 'react-i18next';

import styles from './Create.module.css';

import {
  Container,
  Avatar,
  Paper,
  Button,
} from '../../../components/Custom';
import {
  TextField,
  Typography,
  CardActions,
  CardContent,
  Divider,
} from '../../../components/MUI';

export default function CreateOrganization(props) {
  const { t } = useTranslation();

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
      const res = await api('/api/organization', {
        method: 'POST',
        body: JSON.stringify({
          name,
        }),
      });

      if (res.status === 405) {
        goTo(ROUTES.login); //expired token TODO
      }

      if (res.status === 406) {
        // Not a user
      }
      console.log(res);
      goTo(ROUTES.organization, { id: res.data });
      setIsLoading(false);
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
                    {t('create_organization')}
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
                    {t('create_organization')}
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
