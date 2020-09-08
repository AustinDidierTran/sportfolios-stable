import React, { useState } from 'react';

import { Card, FormDialog } from '../../../../components/Custom';
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

export default function ChangeGame(props) {
  const { game, update, role } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [gameDialog, setGameDialog] = useState(false);

  const handleClose = () => {
    setGameDialog(false);
  };

  const validate = values => {
    const { score1, score2 } = values;
    const errors = {};
    if (!score1) {
      errors.score1 = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!score2) {
      errors.score2 = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

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
      const res = await api('/api/entity/score', {
        method: 'POST',
        body: JSON.stringify({
          score: score1,
          teamId: game.teams[0].id,
          gameId: game.id,
        }),
      });
      const res1 = await api('/api/entity/score', {
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

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('done'),
      color: 'primary',
    },
  ];

  const fields = game.teams.map((team, index) => {
    return {
      type: 'number',
      namespace: `score${index + 1}`,
      label: team.name,
    };
  });

  const gameClick = () => {
    setGameDialog(true);
  };

  if (role === ENTITIES_ROLE_ENUM.ADMIN) {
    return (
      <>
        <div onClick={gameClick}>
          <Card items={game} type={CARD_TYPE_ENUM.GAME} />
        </div>
        <FormDialog
          open={gameDialog}
          onClose={handleClose}
          title={t('enter_score')}
          fields={fields}
          formik={formik}
          buttons={buttons}
        ></FormDialog>
      </>
    );
  }
  return <Card items={game} type={CARD_TYPE_ENUM.GAME} />;
}
