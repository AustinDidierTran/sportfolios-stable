import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormInput } from '../../../hooks/forms';
import { useContext } from 'react';

import styles from './CreateItem.module.css';
import { Store } from '../../../Store';

import { TextField } from '../../../components/MUI';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Button, Paper, Input } from '../../../components/Custom';
import { createItem, onImgUpload } from '../../../utils/shop';

export default function CreateItem(props) {
  const { id } = useParams();
  const { fetchItems } = props;
  const { dispatch } = useContext(Store);

  const [isCreating, setIsCreating] = useState(false);
  const [img, setImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const name = useFormInput('');
  const amount = useFormInput('');
  const description = useFormInput('');

  const onImgChange = async ([file]) => {
    setImg(file);
  };

  const onUpload = async () => {
    const res = await onImgUpload(id, img, dispatch);
    setPhotoUrl(res.photoUrl);
  };

  const reset = () => {
    setIsCreating(!isCreating);
  };

  const addToStore = async () => {
    await createItem({
      name: name.value,
      description: description.value,
      amount: amount.value,
      photo_url: photoUrl,
      entity_id: id,
    });
    setIsCreating(!isCreating);
    name.reset();
    amount.reset();
    description.reset();
    fetchItems();
  };

  if (!isCreating) {
    return <Button onClick={reset}>Add new Product</Button>;
  }

  return (
    <Paper>
      {photoUrl ? (
        <>
          <CardMedia className={styles.media} image={photoUrl} />
          <Button onClick={() => setPhotoUrl(null)}>CHANGE</Button>
        </>
      ) : (
        <div className={styles.media}>
          <Input type="file" onChange={onImgChange} />
          <Button onClick={onUpload}>UPLOAD</Button>
        </div>
      )}
      <CardContent className={styles.infos}>
        <TextField
          {...name.inputProps}
          placeholder="Name"
          className={styles.name}
        />
        <TextField
          {...amount.inputProps}
          placeholder="0.00$"
          className={styles.price}
        />
        <TextField
          {...description.inputProps}
          placeholder="description"
          className={styles.description}
        />

        <Button
          size="small"
          color="default"
          endIcon="Store"
          onClick={addToStore}
          className={styles.cart}
        >
          AJOUTER
        </Button>
        <Button onClick={reset} className={styles.cancel}>
          CANCEL
        </Button>
      </CardContent>
    </Paper>
  );
}
