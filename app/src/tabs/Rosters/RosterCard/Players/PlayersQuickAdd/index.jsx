import { Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../../../common/enums';
import { Button, List } from '../../../../../components/Custom';

export default function PersonsQuickAdd(props) {
  const { t } = useTranslation();
  const { persons, title, onAdd } = props;
  if (!persons || !persons.length) {
    return <> </>;
  }

  return (
    <>
      <Typography align="left" variant="subtitle1">
        {title}
      </Typography>
      <List
        items={persons.map(p => ({
          ...p,
          type: GLOBAL_ENUM.PERSON,
          completeName: p.name + ' ' + p.surname,
          secondaryActions: [
            <Button
              endIcon="Add"
              onClick={() =>
                onAdd({
                  id: p.entity_id,
                  name: p.name,
                })
              }
            >
              {t('add')}
            </Button>,
          ],
          notClickable: true,
        }))}
      />
    </>
  );
}
