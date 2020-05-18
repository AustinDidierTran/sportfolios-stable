import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
} from '../../../components/MUI';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import styles from './Organization.module.css';
import { useTranslation } from 'react-i18next';
import NextEvents from './NextEvents';
import Shop from './Shop';

export default function selfProfile(props) {
  const { t } = useTranslation();

  const [general, setGeneral] = useState(true);

  const [shop, setShop] = useState(false);

  const generalClick = () => {
    setShop(false);
    setGeneral(true);
  };
  const shopClick = () => {
    setGeneral(false);
    setShop(true);
  };

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <BasicInfos />
        <ButtonGroup className={styles.buttons}>
          {general ? (
            <Button
              onClick={generalClick}
              variant="contained"
              color="primary"
            >
              General
            </Button>
          ) : (
            <Button onClick={generalClick} variant="contained">
              General
            </Button>
          )}
          {shop ? (
            <Button
              onClick={shopClick}
              variant="contained"
              color="primary"
            >
              Shop
            </Button>
          ) : (
            <Button onClick={shopClick} variant="contained">
              Shop
            </Button>
          )}
        </ButtonGroup>
        {general ? <NextEvents /> : <> </>}
        {shop ? <Shop /> : <> </>}
      </Container>
    </div>
  );
}
