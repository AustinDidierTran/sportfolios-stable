import React, { useMemo, useState } from 'react';

import { List, Icon } from '../..';
import { TextField } from '../../../MUI';
import { formatRoute } from '../../../../actions/goTo';
import { useApiRoute } from '../../../../hooks/queries';
import { useFormInput } from '../../../../hooks/forms';
import { InputAdornment } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../../common/enums';
import AddNonExistingPlayer from './AddNonExistingPlayer';

export default function PersonSearchList(props) {
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
    isSub,
    onChange,
    handleClose,
    rosterId,
    addedByEventAdmin,
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
    onClick(args[0]);
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
          key: 'create',
        },
        ...response.entities
          .filter(entity => !rejectedTypes.includes(entity.type))
          .map(e => {
            return {
              ...e,
              secondary,
              onClick: () => {
                handleClick(e);
              },
              key: e.id,
            };
          }),
      ];
    }
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
    if (e.key === 'Enter') {
      openDialog(e.target.value);
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const close = id => {
    query.reset();
    handleClose(id);
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
      <AddNonExistingPlayer
        addedByEventAdmin={addedByEventAdmin}
        open={open}
        onClose={onClose}
        name={name}
        isSub={isSub}
        onChange={onChange}
        onClick={onClick}
        handleClose={close}
        rosterId={rosterId}
      />
    </>
  );
}
