import React, { useMemo } from 'react';

import { List, Icon } from '../..';
import { TextField } from '../../../MUI';
import { formatRoute } from '../../../../actions/goTo';
import { useApiRoute } from '../../../../hooks/queries';
import { useFormInput } from '../../../../hooks/forms';
import { InputAdornment } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../../common/enums';

export default function PersonSearchList(props) {
  const {
    blackList,
    whiteList,
    label,
    onClick,
    rejectedTypes = [],
    withoutIcon,
    secondary,
    style,
    autoFocus,
  } = props;
  const { t } = useTranslation();
  const query = useFormInput('');

  const optionsRoute = useMemo(() => {
    if (!query.value) {
      return;
    }
    const body = {
      query: query.value,
      type: GLOBAL_ENUM.PERSON,
    };
    if (whiteList) {
      body.whiteList = JSON.stringify(whiteList);
    }
    if (blackList) {
      body.blackList = JSON.stringify(blackList);
    }
    const res = formatRoute('/api/data/search/global', null, body);
    return res;
  }, [query]);

  const { response } = useApiRoute(optionsRoute, {
    defaultValue: { entities: [] },
  });
  const handleClick = e => {
    onClick(e);
    query.reset();
  };

  const options = useMemo(() => {
    return response.entities
      .filter(entity => !rejectedTypes.includes(entity.type))
      .map(e => ({
        ...e,
        secondary,
        onClick: () => {
          handleClick(e);
        },
        key: e.id,
      }));
  }, [response]);

  const handleChange = value => {
    if (value.length > 64) {
      query.setError(t('max_length'));
    } else {
      query.setError(null);
      query.onChange(value);
    }
  };

  const onEnter = e => {
    if (e.key === 'Enter' && options?.length) {
      onClick(options[0]);
    }
  };
  return (
    <>
      {withoutIcon ? (
        <TextField
          {...query.inputProps}
          onChange={handleChange}
          variant="outlined"
          size="small"
          label={label}
          autoFocus={autoFocus}
          style={{ width: '100%', ...style }}
          onKeyPress={onEnter}
        />
      ) : (
        <TextField
          {...query.inputProps}
          variant="outlined"
          label={label}
          style={{ margin: '8px', ...style }}
          size="small"
          autoFocus={autoFocus}
          onKeyPress={onEnter}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="Search" />
              </InputAdornment>
            ),
          }}
        />
      )}
      {query.value.length === 0 ? (
        <></>
      ) : (
        <List items={options}></List>
      )}
    </>
  );
}
