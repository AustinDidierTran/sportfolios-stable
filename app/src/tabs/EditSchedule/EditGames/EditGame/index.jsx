import React, { useState } from 'react';

import { Card, AlertDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { CARD_TYPE_ENUM } from '../../../../../../common/enums';
import EditGameDialog from './EditGameDialog';
import { formatRoute } from '../../../../actions/goTo';
import EnterScore from './EnterScore';

export default function EditGame(props) {
  const { game, update } = props;
  const { t } = useTranslation();

  const [gameDialog, setGameDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const closeGameDialog = () => {
    setGameDialog(false);
  };

  const closeDelete = () => {
    setDeleteDialogIsOpen(false);
  };

  const gameClick = () => {
    setGameDialog(true);
  };

  const onEdit = () => {
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
  };

  const onDelete = () => {
    setDeleteDialogIsOpen(true);
  };

  const onDeleteConfirmed = async () => {
    await api(
      formatRoute('/api/entity/game', null, {
        eventId: game.eventId,
        gameId: game.id,
      }),
      {
        method: 'DELETE',
      },
    );
    setDeleteDialogIsOpen(false);
    update();
  };

  return (
    <>
      <Card
        items={{
          ...game,
          onClick: gameClick,
          onEdit: onEdit,
          onDelete: onDelete,
        }}
        type={CARD_TYPE_ENUM.TWO_TEAM_GAME_EDITABLE}
      />
      <EnterScore
        open={gameDialog}
        onClose={closeGameDialog}
        update={update}
        game={game}
      />
      <EditGameDialog
        open={edit}
        onClose={closeEdit}
        game={game}
        update={update}
      />
      <AlertDialog
        open={deleteDialogIsOpen}
        onCancel={closeDelete}
        onSubmit={onDeleteConfirmed}
        title={t('delete_game_confirmation')}
      />
    </>
  );
}
