import React, { useEffect, useState } from 'react';

import { FormDialog } from '../../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import {
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../../../../common/enums';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../../common/errors';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../../../Store';

export default function EnterScoreAndSpirit(props) {
  const { game, update, open: openProps, onClose } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  useEffect(() => {
    formik.setFieldValue('score1', game.teams[0].score);
    formik.setFieldValue('score2', game.teams[1].score);
    formik.setFieldValue('spirit1', 10);
    formik.setFieldValue('spirit2', 10);
  }, [game]);

  const validate = values => {
    const { score1, score2, spirit1, spirit2 } = values;
    const errors = {};
    if (isNaN(score1)) {
      errors.score1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (isNaN(score2)) {
      errors.score2 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (isNaN(spirit1)) {
      errors.spirit1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (isNaN(spirit2)) {
      errors.spirit2 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      score1: '',
      score2: '',
      spirit1: '',
      spirit2: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { score1, score2, spirit1, spirit2 } = values;
      const res = await api('/api/entity/scoreAndSpirit', {
        method: 'POST',
        body: JSON.stringify({
          score: score1,
          spirit: spirit1,
          teamId: game.teams[0].id,
          gameId: game.id,
        }),
      });
      const res1 = await api('/api/entity/scoreAndSpirit', {
        method: 'POST',
        body: JSON.stringify({
          score: score2,
          spirit: spirit2,
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
        onClose();
      }
    },
  });

  const formButtons = [
    {
      onClick: onClose,
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
      {
        type: 'number',
        namespace: `spirit${index + 1}`,
        label: `${t('spirit')} ${curr.name}`,
      },
    ],
    [],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={t('enter_score')}
      fields={fields}
      formik={formik}
      buttons={formButtons}
    ></FormDialog>
  );
}
