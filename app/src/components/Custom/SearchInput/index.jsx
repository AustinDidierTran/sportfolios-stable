import React, { useEffect, useMemo, useState } from 'react';

import { fade, makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '../../Custom';
import { goTo, goToAndReplace, ROUTES } from '../../../actions/goTo';
import { useApiRoute, useQuery } from '../../../hooks/queries';
import { useLocation } from 'react-router-dom';

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
      options={options}
      onChange={onChange}
      freeSolo
      inputProps={{
        className: classes.search,
      }}
      icon="Search"
    />
  );
}
