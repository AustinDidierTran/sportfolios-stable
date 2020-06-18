import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fade, makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '../../Custom';
import {
  goBack,
  goTo,
  goToAndReplace,
  ROUTES,
} from '../../../actions/goTo';
import { useApiRoute } from '../../../hooks/queries';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import { InputBase } from '../../MUI';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  typography: {
    padding: theme.spacing(2),
  },
  paper: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
  },
}));

export default function SearchInput(props) {
  const { t } = useTranslation();
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

  const onChange = event => {
    setQuery(event.target.value);
  };

  return (
    <Autocomplete
      options={options}
      onChange={onChange}
      inputProps={{
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
      }}
      renderInput={params => {
        return (
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              inputProps={params.InputProps}
              {...params}
              onChange={onChange}
              label={t('search')}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
        );
      }}
    />
  );
}
