import React, { useEffect, useMemo, useState } from 'react';

import { fade, makeStyles } from '@material-ui/core/styles';
import { Autocomplete, Icon } from '../../Custom';
import {
  goBack,
  goTo,
  goToAndReplace,
  ROUTES,
} from '../../../actions/goTo';
import { useApiRoute } from '../../../hooks/queries';
import { useLocation } from 'react-router-dom';
import { InputAdornment } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.85),
    color: theme.palette.common.white,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '100%',
      minWidth: 240,
    },
  },
}));

export default function SearchInput(props) {
  const classes = useStyles();
  const { searchQuery = '/api/data/search/previous' } = props;
  const location = useLocation();

  const apiRes = useApiRoute(searchQuery);

  const [query, setQuery] = useState('');

  const options = useMemo(() => {
    if (apiRes) {
      return apiRes.map(ar => ({ value: ar, display: ar }));
    }
    return [];
  }, [apiRes]);

  useEffect(() => {
    if (location.pathname === ROUTES.search) {
      if (query) {
        goToAndReplace(ROUTES.search, null, { query });
      } else {
        goBack();
      }
    } else {
      if (query) {
        goTo(ROUTES.search, null, { query });
      } else {
        goTo(ROUTES.home);
      }
    }
  }, [query]);

  const onChange = value => {
    setQuery(value);
  };

  return (
    <Autocomplete
      options={options}
      onChange={onChange}
      freeSolo
      inputProps={{
        className: classes.search,
        InputProps: {
          startAdornment: (
            <InputAdornment>
              <Icon icon="Search" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
