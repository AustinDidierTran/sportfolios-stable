import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { List, ListSubheader } from '../../MUI';
import DefaultItem from './DefaultItem';
import PersonItem from './PersonItem';

import { ENTITIES_TYPE_ENUM } from '../../../../../common/enums';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function CustomList(props) {
  const { title, items, ref, rowRenderer, selectedIndex } = props;
  const classes = useStyles();

  const defaultRowRenderer = (item, index) => {
    if (item.type === ENTITIES_TYPE_ENUM.ORGANIZATION) {
      return (
        <DefaultItem {...item} selected={selectedIndex === index} />
      );
    }
    if (item.type === ENTITIES_TYPE_ENUM.PERSON) {
      return (
        <PersonItem {...item} selected={selectedIndex === index} />
      );
    }
    return (
      <DefaultItem {...item} selected={selectedIndex === index} />
    );
  };

  return (
    <List
      ref={ref}
      style={{ maxWidth: 'unset' }}
      aria-labelledby="nested-list-subheader"
      subheader={
        title ? (
          <ListSubheader component="div" id="nested-list-subheader">
            {title}
          </ListSubheader>
        ) : (
          <></>
        )
      }
      className={classes.root}
      disablePadding
    >
      {items && items.map(rowRenderer || defaultRowRenderer)}
    </List>
  );
}
