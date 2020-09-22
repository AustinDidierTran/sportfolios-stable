import React, { useState } from 'react';

import { Card, AlertDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import {
  CARD_TYPE_ENUM,
  ENTITIES_ROLE_ENUM,
} from '../../../../../../common/enums';
import EditGame from './EditGame';
import { formatRoute } from '../../../../actions/goTo';
import SubmitScoreDialog from '../../SubmitScore/SubmitScoreDialog';
import EnterScoreAndSpirit from './EnterScoreAndSpirit';

export default function ChangeGame(props) {
  const { game, update, role } = props;
  const { t } = useTranslation();

  const [gameDialog, setGameDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [submitScore, setSubmitScore] = useState(false);

  const closeGameDialog = () => {
    setGameDialog(false);
  };

  const closeDelete = () => {
    setDeleteDialogIsOpen(false);
  };

  const closeSubmitScore = () => {
    setSubmitScore(false);
  };
  const openSubmitScore = () => {
    setSubmitScore(true);
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
  if (
    role === ENTITIES_ROLE_ENUM.ADMIN ||
    role === ENTITIES_ROLE_ENUM.EDITOR
  ) {
    return (
      <>
        <Card
          items={{
            ...game,
            role,
            onClick: gameClick,
            onEdit: onEdit,
            onDelete: onDelete,
          }}
          type={CARD_TYPE_ENUM.GAME}
        />
        <EnterScoreAndSpirit
          open={gameDialog}
          onClose={closeGameDialog}
          update={update}
          game={game}
        />
        <EditGame
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
  return (
    <>
      <Card
        items={{
          ...game,
          onClick: openSubmitScore,
          role,
        }}
        type={CARD_TYPE_ENUM.GAME}
      />
      <SubmitScoreDialog
        open={submitScore}
        onClose={closeSubmitScore}
        game={game}
      />
    </>
  );
}
