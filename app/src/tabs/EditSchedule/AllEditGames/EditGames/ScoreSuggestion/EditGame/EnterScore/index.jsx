import React, { useEffect, useState } from 'react';

import { FormDialog } from '../../../../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../../../../actions/api';
import {
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../../../../../../common/enums';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../../../../common/errors';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../../../../../Store';

export default function EnterScore(props) {
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
  }, [game]);

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
      const res = await api('/api/entity/gameScore', {
        method: 'POST',
        body: JSON.stringify({
          eventId: game.event_id,
          gameId: game.id,
          score: {
            [game.teams[0].roster_id]: score1,
            [game.teams[1].roster_id]: score2,
          },
          isManualAdd: true,
        }),
      });
      resetForm();
      if (res.status === STATUS_ENUM.SUCCESS) {
        update();
        onClose();
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
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
        autoFocus: index === 0,
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
