import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import { SIZES_ENUM } from '../../../../../common/enums';
const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const options = Object.keys(SIZES_ENUM);

function getStyles(size, sizes, theme) {
  if (sizes.indexOf(size) === -1) {
    return { fontWeight: theme.typography.fontWeightRegular };
  }
  return { fontWeight: theme.typography.fontWeightMedium };
}

export default function AddSizes(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { handleChange, sizes } = props;

  return (
    <div {...props}>
      <FormControl className={classes.formControl}>
        <InputLabel>{t('sizes')}</InputLabel>
        <Select
          multiple
          value={sizes}
          onChange={handleChange}
          input={<Input />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(value => (
                <Chip
                  key={value}
                  label={value}
                  className={classes.chip}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {options.map(size => (
            <MenuItem
              key={size}
              value={size}
              style={getStyles(size, sizes, theme)}
            >
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
