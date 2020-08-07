import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormInput } from '../../../hooks/forms';
import { useContext } from 'react';

import styles from './EditItem.module.css';
import { Store } from '../../../Store';

import { TextField, Typography } from '../../../components/MUI';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Button, Paper, Input } from '../../../components/Custom';
import { editItem, onImgUpload } from '../../../utils/shop';
import { ERROR_ENUM } from '../../../../../common/errors';
import { useTranslation } from 'react-i18next';
import AddSizes from '../AddSizes';
import { TextareaAutosize } from '@material-ui/core';

export default function EditItem(props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const { fetchItems, isEditing, setIsEditing, item } = props;
  const { dispatch } = useContext(Store);

  const [img, setImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(item.photoUrl);
  const [error, setError] = useState(null);
  const [sizes, setSizes] = useState([]);

  const name = useFormInput(item.name);
  const amount = item.price / 100;
  const description = useFormInput(item.description);

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

  const reset = () => {
    setIsEditing(!isEditing);
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
      await editItem({
        name: name.value,
        description: encodeURIComponent(description.value),
        amount: amount,
        photoUrl,
        entityId: id,
        sizes,
        stripePriceIdToUpdate: item.stripePriceId,
      });
      setIsEditing(!isEditing);
      name.reset();
      description.reset();
      fetchItems();
    }
  };

  if (!isEditing) {
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
        <Typography
          className={styles.price}
        >{`${amount} CAD`}</Typography>
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
          {t('done')}
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
