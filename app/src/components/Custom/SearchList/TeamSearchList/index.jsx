import React, { useMemo } from 'react';

import { List, Icon } from '../..';
import { TextField } from '../../../MUI';
import { formatRoute } from '../../../../actions/goTo';
import { useApiRoute } from '../../../../hooks/queries';
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
    formik,
  } = props;
  const { t } = useTranslation();

  // change the way this global search is done
  // return all person team. If already registered to the event, show it during team search (bool)
  const optionsRoute = useMemo(() => {
    if (whiteList) {
      const res = formatRoute('/api/data/search/global', null, {
        whiteList: JSON.stringify(whiteList),
        query: formik.values.teamSearchQuery,
        type: GLOBAL_ENUM.TEAM,
      });
      return res;
    }
    if (blackList) {
      if (blackList.length > 0) {
        const res = formatRoute('/api/data/search/global', null, {
          blackList: JSON.stringify(blackList),
          query: formik.values.teamSearchQuery,
          type: GLOBAL_ENUM.TEAM,
        });
        return res;
      }
    }

    const res = formatRoute('/api/data/search/global', null, {
      query: formik.values.teamSearchQuery,
      type: GLOBAL_ENUM.TEAM,
    });
    return res;
  }, [formik.values.teamSearchQuery]);

  const { response } = useApiRoute(optionsRoute, {
    defaultValue: { entities: [] },
  });

  const handleClick = (...args) => {
    formik.setFieldValue('team', args[1]);
    formik.setFieldValue('teamSearchQuery', '');
  };

  const options = useMemo(() => {
    if (allowCreate) {
      return [
        {
          name: formik.values.teamSearchQuery,
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
      formik.setFieldError('teamSearchQuery', t('max_length'));
    } else {
      formik.setFieldError('teamSearchQuery', null);
      formik.setFieldValue('teamSearchQuery', value);
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
        formik.setFieldValue('teamSearchQuery', '');
      }
    }
  };

  return (
    <>
      {withoutIcon ? (
        <TextField
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
      {formik.values.teamSearchQuery.length === 0 ? (
        <></>
      ) : (
        <List items={options}></List>
      )}
    </>
  );
}
