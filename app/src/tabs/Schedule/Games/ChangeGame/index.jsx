import React, { useEffect, useState } from 'react';

import {
  Card,
  FormDialog,
  AlertDialog,
} from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import {
  CARD_TYPE_ENUM,
  STATUS_ENUM,
  SEVERITY_ENUM,
  ENTITIES_ROLE_ENUM,
} from '../../../../../../common/enums';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../common/errors';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../../Store';
import EditGame from './EditGame';
import { formatRoute } from '../../../../actions/goTo';

export default function ChangeGame(props) {
  const { game, update, role } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [gameDialog, setGameDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const closeGame = () => {
    setGameDialog(false);
  };

  const validate = values => {
    const { score1, score2 } = values;
    const errors = {};
    if (isNaN(score1)) {
      errors.score1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (isNaN(score2)) {
      errors.score2 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    return errors;
  };

  const closeDelete = () => {
    setDeleteDialogIsOpen(false);
  };

  useEffect(() => {
    formik.setFieldValue('score1', game.teams[0].score);
    formik.setFieldValue('score2', game.teams[1].score);
  }, [game]);

  const formik = useFormik({
    initialValues: {
      score1: '',
      score2: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { score1, score2 } = values;
      const res = await api('/api/entity/scoreAndSpirit', {
        method: 'POST',
        body: JSON.stringify({
          score: score1,
          teamId: game.teams[0].id,
          gameId: game.id,
        }),
      });
      const res1 = await api('/api/entity/scoreAndSpirit', {
        method: 'POST',
        body: JSON.stringify({
          score: score2,
          teamId: game.teams[1].id,
          gameId: game.id,
        }),
      });
      resetForm();
      if (
        res.status === STATUS_ENUM.ERROR ||
        res1.status === STATUS_ENUM.ERROR
      ) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        update();
        setGameDialog(false);
      }
    },
  });

  const formButtons = [
    {
      onClick: closeGame,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('done'),
      color: 'primary',
    },
  ];

  const fields = game.teams.reduce(
    (prev, curr, index) => [
      ...prev,
      {
        type: 'number',
        namespace: `score${index + 1}`,
        label: `${t('score')} ${curr.name}`,
      },
    ],
    [],
  );

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
        <FormDialog
          open={gameDialog}
          onClose={closeGame}
          title={t('enter_score')}
          fields={fields}
          formik={formik}
          buttons={formButtons}
        ></FormDialog>
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
    <Card
      items={{
        ...game,
        role,
      }}
      type={CARD_TYPE_ENUM.GAME}
    />
  );
}
