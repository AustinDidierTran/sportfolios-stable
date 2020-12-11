import React, { useEffect, useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '../../Custom';
import { goTo, goToAndReplace, ROUTES } from '../../../actions/goTo';
import { useApiRoute, useQuery } from '../../../hooks/queries';
import { useLocation } from 'react-router-dom';

import styles from './SearchInput.module.css';

const useStyles = makeStyles(theme => ({
  inputRoot: {
    color: theme.palette.common.white,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      minWidth: 240,
    },
  },
  clearIndicator: {
    color: theme.palette.common.white,
  },
}));

export default function SearchInput(props) {
  const classes = useStyles();
  const { searchQuery = '/api/data/search/previous', type } = props;
  const location = useLocation();
  const { query: queryQuery } = useQuery();

  const { response: apiRes } = useApiRoute(searchQuery);

  const [query, setQuery] = useState(queryQuery);

  const options = useMemo(() => {
    if (apiRes) {
      return apiRes.map(ar => ({ value: ar, display: ar }));
    }
    return [];
  }, [apiRes]);

  useEffect(() => {
    if (query) {
      if (location.pathname === ROUTES.search) {
        goToAndReplace(ROUTES.search, null, { query, type });
      } else {
        goTo(ROUTES.search, null, { query, type });
      }
    }
  }, [query]);

  const onChange = value => {
    setQuery(value);
  };

  return (
    <Autocomplete
      classes={classes}
      options={options}
      onChange={onChange}
      freeSolo
      inputProps={{
        className: styles.searchBox,
      }}
      icon="Search"
      iconColor="white"
    />
  );
}
