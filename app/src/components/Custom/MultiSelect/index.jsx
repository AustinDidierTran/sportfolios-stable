import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import { makeStyles, useTheme } from '@material-ui/core/styles';

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

function getStyles(opt, options, theme) {
  if (options.indexOf(opt) === -1) {
    return { fontWeight: theme.typography.fontWeightRegular };
  }
  return { fontWeight: theme.typography.fontWeightMedium };
}

export default function CustomMultiSelect(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    formik,
    label,
    onChange,
    options,
    values,
    disabled = false,
  } = props;

  const handleChange = (event, ...args) => {
    if (formik) {
      formik.handleChange(event, ...args);
    }
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div {...props}>
      <FormControl className={classes.formControl}>
        <InputLabel>{label}</InputLabel>
        <Select
          disabled={disabled}
          multiple
          value={values}
          onChange={handleChange}
          input={<Input />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(item => {
                return (
                  <Chip
                    key={item?.value || item}
                    label={item?.display || item}
                    className={classes.chip}
                  />
                );
              })}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {options.map(opt => (
            <MenuItem
              key={opt?.value || opt}
              value={opt}
              style={getStyles(opt, options, theme)}
            >
              {opt?.display || opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
