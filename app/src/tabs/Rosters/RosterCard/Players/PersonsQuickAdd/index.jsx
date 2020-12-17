import { Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../../../common/enums';
import { Button, List } from '../../../../../components/Custom';

export default function PersonsQuickAdd(props) {
  const { t } = useTranslation();
  const {
    persons,
    title,
    onAdd,
    titleClassName,
    onRemove,
    personsSortingFunction = () => {},
  } = props;
  if (!persons?.length) {
    return null;
  }

  const items = useMemo(
    () =>
      persons.sort(personsSortingFunction).map(p => ({
        ...p,
        type: GLOBAL_ENUM.PERSON,
        completeName: p.name + ' ' + p.surname,
        secondaryActions: [
          p.teamPlayerId ? (
            <Button
              color="secondary"
              endIcon="Delete"
              onClick={() => onRemove(p.teamPlayerId)}
            >
              {t('remove')}
            </Button>
          ) : (
            <Button
              endIcon="Add"
              onClick={() =>
                onAdd({
                  id: p.entity_id,
                })
              }
            >
              {t('add')}
            </Button>
          ),
        ],
        notClickable: true,
      })),
    [persons],
  );

  return (
    <>
      <Typography className={titleClassName} variant="h6">
        {title}
      </Typography>
      <List items={items} />
    </>
  );
}
