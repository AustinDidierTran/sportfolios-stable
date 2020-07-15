import React, { useMemo } from 'react';

import { List, Icon } from '../../Custom';
import { TextField } from '../../MUI';
import { formatRoute } from '../../../actions/goTo';
import { useApiRoute } from '../../../hooks/queries';
import { useFormInput } from '../../../hooks/forms';
import { InputAdornment } from '@material-ui/core';

export default function SearchList(props) {
  const {
    blackList,
    label,
    onClick,
    type,
    rejectedTypes = [],
  } = props;

  const query = useFormInput('');

  const optionsRoute = useMemo(
    () =>
      formatRoute('/api/data/search/global', null, {
        blackList: JSON.stringify(blackList),
        query: query.value,
        type,
      }),
    [query, type],
  );

  const { response } = useApiRoute(optionsRoute, {
    defaultValue: { entities: [] },
  });

  const options = useMemo(
    () =>
      response.entities
        .filter(entity => !rejectedTypes.includes(entity.type))
        .map(e => ({ ...e, onClick })),
    [response],
  );

  return (
    <>
      <TextField
        {...query.inputProps}
        variant="outlined"
        label={label}
        style={{ margin: '8px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon="Search" />
            </InputAdornment>
          ),
        }}
      />
      {query.value.length === 0 ? (
        <></>
      ) : (
        <List items={options}></List>
      )}
    </>
  );
}
