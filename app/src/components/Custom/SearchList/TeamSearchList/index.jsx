import React, { useMemo } from 'react';

import { List, Icon } from '../..';
import { TextField } from '../../../MUI';
import { formatRoute } from '../../../../actions/goTo';
import { useApiRoute } from '../../../../hooks/queries';
import { useFormInput } from '../../../../hooks/forms';
import { InputAdornment } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../../common/enums';

export default function TeamSearchList(props) {
  const {
    blackList,
    whiteList,
    label,
    onClick,
    rejectedTypes = [],
    allowCreate,
    withoutIcon,
    secondary,
    style,
    autoFocus,
  } = props;

  const { t } = useTranslation();
  const query = useFormInput('');

  const optionsRoute = useMemo(() => {
    if (whiteList) {
      const res = formatRoute('/api/data/search/global', null, {
        whiteList: JSON.stringify(whiteList),
        query: query.value,
        type: GLOBAL_ENUM.TEAM,
      });
      return res;
    }
    if (blackList) {
      if (blackList.length > 0) {
        const res = formatRoute('/api/data/search/global', null, {
          blackList: JSON.stringify(blackList),
          query: query.value,
          type: GLOBAL_ENUM.TEAM,
        });
        return res;
      }
    }

    const res = formatRoute('/api/data/search/global', null, {
      query: query.value,
      type: GLOBAL_ENUM.TEAM,
    });
    return res;
  }, [query]);

  const { response } = useApiRoute(optionsRoute, {
    defaultValue: { entities: [] },
  });

  const handleClick = (...args) => {
    onClick(...args);
    query.reset();
  };

  const options = useMemo(() => {
    if (allowCreate) {
      return [
        {
          name: query.value,
          type: GLOBAL_ENUM.TEAM,
          secondary: t('click_to_create_new_team'),
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
        const entity = {};
        entity.id = options[0].id;
        if (entity.id) {
          entity.name = options[0].completeName;
        } else {
          entity.name = options[0].name;
        }
        onClick(e, entity);
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
