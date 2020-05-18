import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Shop.module.css';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { Avatar } from '../../../../components/Custom';
import {
  Button,
  Typography,
  Container,
} from '../../../../components/MUI';

export default function BasicInfos(props) {
  return (
    <ButtonGroup
      variant="contained"
      color="primary"
      className={styles.buttons}
    >
      <Button>Inscription</Button>
      <Button>Shop</Button>
    </ButtonGroup>
  );
}
