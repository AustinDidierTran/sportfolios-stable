import React, { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function EditPrimaryPerson(props) {
  const { t } = useTranslation();
  const { persons, open, handleClose, handleSubmit } = props;
  const [selectedValue, setSelectedValue] = useState(persons[0].id);

  const handleChange = event => {
    setSelectedValue(event.target.value);
  };

  const onClick = () => {
    handleSubmit(selectedValue);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('choose_your_primary_person')}</DialogTitle>
      <DialogContent>
        <FormControl>
          <RadioGroup value={selectedValue} onChange={handleChange}>
            {persons.map(person => (
              <FormControlLabel
                value={person.id}
                control={<Radio />}
                label={person.name + ' ' + person.surname}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          {t('cancel')}
        </Button>
        <Button onClick={onClick} color="primary">
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
