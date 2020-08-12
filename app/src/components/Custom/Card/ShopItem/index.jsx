import React, { useState, useMemo } from 'react';

import styles from './ShopItem.module.css';

import { Typography } from '../../../MUI';
import { Paper, Button } from '../..';
import CardContent from '@material-ui/core/CardContent';
import { useParams } from 'react-router-dom';
import { goTo, ROUTES, formatRoute } from '../../../../actions/goTo';
import { formatPrice } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import ImageCard from '../../ImageCard';

import EditItem from '../../../../tabs/Shop/EditItem';
import { TextareaAutosize } from '@material-ui/core';

export default function ShopItem(props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const {
    label: name,
    amount: price,
    photoUrl,
    description,
    stripePriceId,
    stripeProductId,
    isEditor,
    update,
    fetchItems,
    button,
  } = props;

  const text = useMemo(() => decodeURIComponent(description), [
    description,
  ]);

  const onPaperClick = () => {
    goTo(ROUTES.shopDetails, { id, stripePriceId });
  };

  const deleteItem = async () => {
    await api(
      formatRoute('/api/stripe/deleteItem', null, {
        stripeProductId,
        stripePriceId,
      }),
      {
        method: 'DELETE',
      },
    );
    update();
  };

  const editItem = () => {
    setIsEditing(!isEditing);
  };

  if (isEditing) {
    return (
      <EditItem
        item={{
          name,
          price,
          photoUrl,
          description,
          stripePriceId,
          stripeProductId,
        }}
        fetchItems={fetchItems}
        isEditing={isEditing}
        setIsEditing={s => setIsEditing(s)}
      />
    );
  }

  return (
    <Paper className={styles.root}>
      <ImageCard
        className={styles.media}
        image={photoUrl}
        onClick={onPaperClick}
      />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="h5" className={styles.price}>
          {formatPrice(price)}
        </Typography>
        <TextareaAutosize
          className={styles.description}
          placeholder="Description"
          value={text}
          disabled
        />
        {button ? (
          <div className={styles.otherButtonMain}>
            <Button
              onClick={() =>
                goTo(ROUTES.shopDetails, { id, stripePriceId })
              }
              className={styles.otherButton}
            >
              {button.name}
            </Button>
          </div>
        ) : (
          <></>
        )}
        {isEditor ? (
          <div className={styles.buttons}>
            <Button
              onClick={editItem}
              endIcon="Settings"
              color="primary"
              className={styles.button}
            >
              {t('edit')}
            </Button>
            <Button
              onClick={deleteItem}
              endIcon="Delete"
              color="secondary"
              className={styles.button}
            >
              {t('delete')}
            </Button>
          </div>
        ) : (
          <></>
        )}
      </CardContent>
    </Paper>
  );
}
