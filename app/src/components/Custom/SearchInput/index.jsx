import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fade, makeStyles } from '@material-ui/core/styles';

import SearchIcon from '@material-ui/icons/Search';

import api from '../../../actions/api';

import { useFormInput } from '../../../hooks/forms';

import { List } from '../../Custom';

import { InputBase, Paper } from '../../MUI';
import { useEffect } from 'react';
import { SEARCH_TYPE_ENUM } from '../../../Store';
import { formatRoute, goTo, ROUTES } from '../../../actions/goTo';

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
  const { type, searchQuery = '/api/data/search/previous' } = props;

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [previousResults, setPreviousResults] = useState([]);
  const searchValue = useFormInput('');
  const { t } = useTranslation();

  const fetchSuggestions = async () => {
    const {
      data: { search_queries },
    } = await api(
      formatRoute(searchQuery, {}, { query: searchValue.value }),
    );
    setPreviousResults(search_queries);
  };

  const goToSearch = query => {
    goTo(ROUTES.search, { query });
    searchValue.reset();
  };

  useEffect(() => {
    fetchSuggestions();
  }, [Boolean(searchValue.value)]);

  useEffect(() => {
    if (searchValue.value) {
      setSelectedIndex(-1);
    }
  }, [searchValue.value]);
  const open = Boolean(searchValue.value);
  const id = useMemo(() => (open ? 'simple-popover' : undefined), [
    open,
  ]);
  const listItems = useMemo(
    () =>
      previousResults &&
      previousResults.map(r => ({
        icon: 'Search',
        value: r,
        onClick: () => {
          goToSearch(r);
        },
      })),
    [previousResults],
  );
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        aria-describedby={id}
        label={t('search')}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{
          'aria-label': 'search',
          onKeyUp: e => {
            // On enter
            if (e.keyCode === 13) {
              if (selectedIndex > -1) {
                goToSearch(previousResults[selectedIndex]);
              } else {
                goToSearch(searchValue.value);
              }
            }

            // On arrow down
            else if (e.keyCode === 40) {
              setSelectedIndex(
                Math.min(
                  (previousResults && previousResults.length - 1) ||
                    -1,
                  selectedIndex + 1,
                ),
              );
            }

            // on arrow up
            else if (e.keyCode === 38) {
              setSelectedIndex(Math.max(-1, selectedIndex - 1));
            }
          },
        }}
        {...searchValue.inputProps}
      />
      <Paper
        className={classes.paper}
        style={{
          display: open ? 'block' : 'none',
        }}
      >
        <List
          title={t('recent_search_results')}
          items={listItems}
          selectedIndex={selectedIndex}
        />
      </Paper>
    </div>
  );
}
