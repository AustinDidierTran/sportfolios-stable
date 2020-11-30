import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { Collapse } from '../../..';
import { TextField, Typography } from '../../../../MUI';
import { Button, IconButton } from '../../..';
import { Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import styles from '../SubmitScoreSpiritForm.module.css';
import { STATUS_ENUM } from '../../../../../../../common/enums';

export default function SectionScore(props) {
  const { suggestion, game, IsSubmittedCheck } = props;
  const { t } = useTranslation();

  const validate = values => {
    const { teamScore1, teamScore2 } = values;
    const errors = {};
    if (teamScore1 < 0) {
      errors.teamScore1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (teamScore2 < 0) {
      errors.teamScore2 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      scoreTeam1: 0,
      scoreTeam2: 0,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { scoreTeam1, scoreTeam2 } = values;
      console.log('submitting score');
    },
  });

  const [expanded, setExpanded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const expandedIcon = useMemo(
    () => (!expanded ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expanded],
  );

  const handleAcceptSuggestion = () => {
    console.log('accept');
  };
  const handleRefuseSuggestion = () => {
    console.log('refuse');
  };

  const onSubmitScore = () => {
    console.log('submitting score');
    setExpanded(false);
    setIsSubmitted(true);
  };

  return (
    <div>
      <div
        className={styles.collapseHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography>{t('score')}</Typography>
        <div className={styles.expand}>
          {isSubmitted ? IsSubmittedCheck : <></>}
          <IconButton
            className={styles.arrowButton}
            aria-expanded={expanded}
            icon={expandedIcon}
            style={{
              color: 'primary',
            }}
          />
        </div>
      </div>
      <Divider />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={styles.teamsScore}>
          <div className={styles.scores}>
            <Typography
              className={styles.teamName}
            >{`${game.teams[0].name}:`}</Typography>
            <TextField
              type="number"
              namespace="scoreTeam1"
              formik={formik}
              formikDisabled={isSubmitted}
            />
            <Typography
              className={styles.teamName}
            >{`${game.teams[1].name}:`}</Typography>
            <TextField
              type="number"
              namespace="scoreTeam2"
              formik={formik}
              formikDisabled={isSubmitted}
            />
          </div>

          {suggestion && suggestion.status === STATUS_ENUM.PENDING ? (
            <div className={styles.acceptRefuseScore}>
              <IconButton
                icon="CheckCircle"
                color="primary"
                onClick={handleAcceptSuggestion}
                tooltip={t('accept')}
              />
              <IconButton
                icon="Cancel"
                color="secondary"
                onClick={handleRefuseSuggestion}
                tooltip={t('refuse')}
              />
            </div>
          ) : (
            <></>
          )}

          <div className={styles.divSubmitScoreButton}>
            <Button
              className={styles.submitButton}
              onClick={onSubmitScore}
              color={'primary'}
              variant="text"
              disabled={isSubmitted}
            >
              {t('submit')}
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
