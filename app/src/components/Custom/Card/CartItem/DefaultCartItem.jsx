import React, { useMemo } from 'react';

import styles from './DefaultCartItem.module.css';

import { Select } from '../../../Custom';
import { Typography } from '../../../MUI';
import { Paper } from '../..';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { formatPrice } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { TextareaAutosize } from '@material-ui/core';

export default function DefaultCartItem(props) {
  const { t } = useTranslation();
  const {
    label: name,
    amount: price,
    photoUrl,
    description,
    updateQuantity,
    metadata = {},
    quantity,
  } = props;

  const text = useMemo(() => decodeURIComponent(description), [
    description,
  ]);

  const { size } = metadata;

  const quantityOptions = Array(Math.max(101, quantity + 1))
    .fill(0)
    .map((_, index) => ({
      value: index,
      display: index,
    }));

  return (
    <Paper className={styles.paper}>
      <CardMedia className={styles.media} image={photoUrl} />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="h6" className={styles.price}>
          {formatPrice(price)}
        </Typography>
        {size ? (
          <Typography
            variant="h6"
            color="textSecondary"
            component="p"
            className={styles.size}
          >
            {t('size')}: {size}
          </Typography>
        ) : (
          <></>
        )}
        <TextareaAutosize
          className={styles.description}
          placeholder="Description"
          value={text}
          disabled
        />
        <Select
          className={styles.quantity}
          onChange={updateQuantity}
          value={quantity}
          options={quantityOptions}
          label={t('quantity')}
          // inputProps={{
          //   min: 0,
          //   style: { textAlign: 'center' },
          // }}
        />
      </CardContent>
    </Paper>
  );
}
