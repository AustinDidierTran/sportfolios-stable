import React, { useMemo } from 'react';

import { List } from '../../Custom';
import { TextField } from '../../MUI';
import { formatRoute } from '../../../actions/goTo';
import { useApiRoute } from '../../../hooks/queries';
import { useFormInput } from '../../../hooks/forms';

export default function SearchList(props) {
  const { type, onClick } = props;

  const query = useFormInput('');

  const optionsRoute = useMemo(
    () =>
      formatRoute('/api/data/search/global', null, {
        query: query.value,
        type,
      }),
    [query, type],
  );
  const response = useApiRoute(optionsRoute, {
    defaultValue: { entities: [] },
  });

  const options = useMemo(
    () => response.entities.map(e => ({ ...e, onClick })),
    [response],
  );

  return (
    <>
      <TextField {...query.inputProps}></TextField>
      <List items={options}></List>
    </>
  );
}
