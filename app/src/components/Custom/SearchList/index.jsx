import React, { useMemo } from 'react';

import { List, Icon } from '../../Custom';
import { TextField } from '../../MUI';
import { formatRoute } from '../../../actions/goTo';
import { useApiRoute } from '../../../hooks/queries';
import { useFormInput } from '../../../hooks/forms';
import { InputAdornment } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../common/enums';

export default function SearchList(props) {
  const {
    blackList,
    whiteList,
    label,
    onClick,
    type,
    rejectedTypes = [],
    allowCreate,
    withoutIcon,
    secondary,
  } = props;

  const { t } = useTranslation();
  const query = useFormInput('');

  const optionsRoute = useMemo(() => {
    if (whiteList) {
      const res = formatRoute('/api/data/search/global', null, {
        whiteList: JSON.stringify(whiteList),
        query: query.value,
        type,
      });
      return res;
    }
    if (blackList) {
      if (blackList.length > 0) {
        return formatRoute('/api/data/search/global', null, {
          blackList: JSON.stringify(blackList),
          query: query.value,
          type,
        });
      }
    }
    return formatRoute('/api/data/search/global', null, {
      query: query.value,
      type,
    });
  }, [query, type]);

  const { response } = useApiRoute(optionsRoute, {
    defaultValue: { entities: [] },
  });

  const handleClick = (...args) => {
    onClick(...args);
    query.reset();
  };

  const options = useMemo(() => {
    if (allowCreate) {
      let uniqueSecondary = '';
      if (type === GLOBAL_ENUM.TEAM) {
        uniqueSecondary = t('click_to_create_new_team');
      }
      if (type === GLOBAL_ENUM.PERSON) {
        uniqueSecondary = t('add_player_with_no_account');
      }
      return [
        {
          name: query.value,
          type,
          secondary: uniqueSecondary,
          onClick: (...args) => {
            handleClick(...args);
          },
          icon: 'Add',
          inverseColor: true,
        },
        ...response.entities
          .filter(entity => !rejectedTypes.includes(entity.type))
          .map(e => ({
            ...e,
            secondary,
            onClick: (...args) => {
              handleClick(...args);
            },
          })),
      ];
    }
    return response.entities
      .filter(entity => !rejectedTypes.includes(entity.type))
      .map(e => ({
        ...e,
        secondary,
        onClick: (...args) => {
          handleClick(...args);
        },
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
    if (e.key === 'Enter') {
      if (e.target.value) {
        onClick(e, options[0]);
        query.reset();
      }
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
          autoFocus
          onKeyPress={onEnter}
          style={{ width: '100%' }}
          autoFocus
          onKeyPress={onEnter}
        />
      ) : (
        <TextField
          {...query.inputProps}
          variant="outlined"
          label={label}
          style={{ margin: '8px' }}
          size="small"
          autoFocus
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
