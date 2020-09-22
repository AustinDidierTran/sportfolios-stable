import React, { useMemo, useState } from 'react';

import { Paper, Button } from '../..';
import { TextField } from '../../../MUI';
import { useFormInput } from '../../../../hooks/forms';
import { deleteEntity } from '../../../../actions/api';
import { goTo, ROUTES } from '../../../../actions/goTo';

import styles from './DeleteEntity.module.css';
import { useTranslation } from 'react-i18next';

export default function DeleteEntity(props) {
  const { t } = useTranslation();
  const { id, name, ...otherProps } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validator = useFormInput('');

  const isValid = useMemo(() => validator.value === name, [
    validator.value,
    name,
  ]);

  const handleClick = async () => {
    setIsSubmitting(true);
    if (!isValid) {
      validator.setError(`To delete, enter ${name}`);
      setIsSubmitting(false);
    } else {
      await deleteEntity(id);
      setIsSubmitting(false);
      goTo(ROUTES.home);
    }
  };

  return (
    <Paper
      title={t('delete')}
      childrenProps={{ className: styles.paper }}
      {...otherProps}
    >
      <TextField
        className={styles.textfield}
        helperText={t('delete_confirmation_text', { name })}
        {...validator.inputProps}
      />

      <Button
        className={styles.button}
        color="secondary"
        onClick={handleClick}
        disabled={isSubmitting || !isValid}
      >
        {t('delete')}
      </Button>
    </Paper>
  );
}
