import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Funding.module.css';
import {
  TextField,
  Card,
  Typography,
} from '../../../../components/MUI';
import Slider from '@material-ui/core/Slider';

export default function Funding(props) {
  const { t } = useTranslation();

  const marks = [
    {
      value: 0,
      label: '0$',
    },
    {
      value: 20,
      label: '20$',
    },
    {
      value: 50,
      label: '50$',
    },
    {
      value: 100,
      label: 'Objectif: 100$',
    },
  ];

  return (
    <Card className={styles.card}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('funding')}</h2>
        <Typography id="discrete-slider-always" gutterBottom>
          Hydra 2020 Campagne de Financement
        </Typography>
        <Slider
          className={styles.slider}
          defaultValue={0}
          aria-labelledby="discrete-slider-always"
          step={1}
          marks={marks}
          valueLabelDisplay="on"
        />
      </div>
    </Card>
  );
}
