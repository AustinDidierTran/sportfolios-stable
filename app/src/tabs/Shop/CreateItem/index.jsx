import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormInput } from '../../../hooks/forms';
import { useContext } from 'react';

import styles from './CreateItem.module.css';
import { Store, ACTION_ENUM } from '../../../Store';

import { TextField } from '../../../components/MUI';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Button, Paper, Input } from '../../../components/Custom';
import { createItem, onImgUpload } from '../../../utils/shop';
import { ERROR_ENUM } from '../../../../../common/errors';
import { useTranslation } from 'react-i18next';
import AddSizes from '../AddSizes';
import { TextareaAutosize } from '@material-ui/core';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';

export default function CreateItem(props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const { fetchItems } = props;
  const { dispatch } = useContext(Store);

  const [isCreating, setIsCreating] = useState(false);
  const [img, setImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [sizes, setSizes] = useState([]);

  const name = useFormInput('');
  const amount = useFormInput('');
  const description = useFormInput('');

  const handleChange = event => {
    setSizes(event.target.value);
  };

  const onImgChange = async ([file]) => {
    setImg(file);
  };

  const onUpload = async () => {
    const res = await onImgUpload(id, img, dispatch);
    setPhotoUrl(res.photoUrl);
  };

  const getHasBankAccount = async () => {
    const res = await api(
      formatRoute('/api/stripe/eventHasBankAccount', null, {
        id,
      }),
    );
    return res.data;
  };

  const reset = async () => {
    const hasBankAccount = await getHasBankAccount();
    if (!hasBankAccount) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_add_product_no_bank_account'),
        severity: 'error',
      });
      setIsCreating(false);
    } else {
      setIsCreating(!isCreating);
    }
  };

  const validateName = value => {
    if (name.value.length > 64) {
      name.reset();
    } else {
      name.setValue(value);
      name.changeDefault(value);
    }
  };
  const validate = () => {
    let res = true;
    if (!name.value) {
      name.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    if (!amount.value) {
      amount.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    if (!description.value) {
      description.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    if (!photoUrl) {
      setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    return res;
  };

  const addToStore = async () => {
    if (validate()) {
      await createItem({
        name: name.value,
        description: encodeURIComponent(description.value),
        amount: amount.value,
        photoUrl,
        entityId: id,
        sizes,
      });
      setIsCreating(!isCreating);
      name.reset();
      amount.reset();
      description.reset();
      fetchItems();
    }
  };

  if (!isCreating) {
    return (
      <div className={styles.button}>
        <Button
          onClick={reset}
          endIcon="Add"
          style={{ margin: '8px' }}
        >
          {t('add_new_product')}
        </Button>
      </div>
    );
  }

  return (
    <Paper style={{ marginBottom: '8px' }}>
      {photoUrl ? (
        <>
          <CardMedia className={styles.media} image={photoUrl} />
          <Button
            onClick={() => setPhotoUrl(null)}
            style={{ margin: '8px' }}
            endIcon="Undo"
          >
            {t('change')}
          </Button>
        </>
      ) : (
        <div className={styles.media}>
          <Input type="file" error={error} onChange={onImgChange} />
          <Button
            onClick={onUpload}
            style={{ margin: '8px' }}
            endIcon="Publish"
          >
            {t('upload')}
          </Button>
        </div>
      )}
      <CardContent className={styles.infos}>
        <TextField
          {...name.inputProps}
          label={t('name')}
          className={styles.name}
          onChange={validateName}
        />
        <TextField
          {...amount.inputProps}
          type="number"
          label={t('price')}
          className={styles.price}
        />
        <TextareaAutosize
          {...description.inputProps}
          placeholder="Description"
          className={styles.description}
        />
        <AddSizes
          className={styles.sizes}
          handleChange={handleChange}
          sizes={sizes}
        />
        <Button
          size="small"
          endIcon="Store"
          onClick={addToStore}
          className={styles.cart}
        >
          {t('add')}
        </Button>
        <Button
          onClick={reset}
          color="secondary"
          endIcon="Close"
          className={styles.cancel}
        >
          {t('cancel')}
        </Button>
      </CardContent>
    </Paper>
  );
}
