import React, { useMemo, useState } from 'react';

import { List, Icon } from '../../../../components/Custom';
import { TextField } from '../../../../components/MUI';
import { formatRoute } from '../../../../actions/goTo';
import { useApiRoute } from '../../../../hooks/queries';
import { useFormInput } from '../../../../hooks/forms';
import { InputAdornment } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../../common/enums';
import AddNonExistingPlayerEventRegistration from './AddNonExistingPlayerEventRegistration';

export default function PersonSearchListEventRegistration(props) {
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
    rosterId,
  } = props;
  const { t } = useTranslation();
  const query = useFormInput('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const optionsRoute = useMemo(() => {
    if (whiteList) {
      const res = formatRoute('/api/data/search/global', null, {
        whiteList: JSON.stringify(whiteList),
        query: query.value,
        type: GLOBAL_ENUM.PERSON,
      });
      return res;
    }
    if (blackList) {
      if (blackList.length > 0) {
        const res = formatRoute('/api/data/search/global', null, {
          blackList: JSON.stringify(blackList),
          query: query.value,
          type: GLOBAL_ENUM.PERSON,
        });
        return res;
      }
    }

    const res = formatRoute('/api/data/search/global', null, {
      query: query.value,
      type: GLOBAL_ENUM.PERSON,
    });
    return res;
  }, [query]);

  const { response } = useApiRoute(optionsRoute, {
    defaultValue: { entities: [] },
  });

  const handleClick = (...args) => {
    onClick(args[1]);
    query.reset();
  };

  const openDialog = name => {
    setName(name);
    setOpen(true);
  };

  const options = useMemo(() => {
    if (allowCreate) {
      return [
        {
          name: query.value,
          type: GLOBAL_ENUM.PERSON,
          secondary: t('add_player_with_no_account'),
          onClick: (...args) => {
            openDialog(args[1].name);
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
      openDialog(e.target.value);
    }
  };

  const onClose = () => {
    setOpen(false);
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
      <AddNonExistingPlayerEventRegistration
        open={open}
        onClose={onClose}
        name={name}
        onAdd={onClick}
        rosterId={rosterId}
      />
    </>
  );
}
