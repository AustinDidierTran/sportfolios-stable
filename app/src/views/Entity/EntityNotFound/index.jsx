import React from 'react';

import { ROUTES, goTo } from '../../../actions/goTo';

import { useTranslation } from 'react-i18next';

import styles from './EntityNotFound.module.css';

import { Container, Paper, Button } from '../../../components/Custom';
import {
  Typography,
  CardActions,
  CardContent,
} from '../../../components/MUI';

export default function EntityNotFound() {
  const { t } = useTranslation();

  const handleClick = () => {
    goTo(ROUTES.home);
  };

  return (
    <div className={styles.main}>
      <Container>
        <Paper className={styles.card}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {t('entity_not_found')}
            </Typography>
          </CardContent>
          <CardActions className={styles.buttons}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              endIcon="Home"
              onClick={handleClick}
            >
              {t('return_home')}
            </Button>
          </CardActions>
        </Paper>
      </Container>
    </div>
  );
}
