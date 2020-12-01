import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFormik } from 'formik';
import { Collapse } from '../../..';
import { TextField, Typography } from '../../../../MUI';
import { Button, IconButton } from '../../..';
import { Divider, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../../common/errors';

import styles from '../SubmitScoreSpiritForm.module.css';
import api from '../../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../../Store';

export default function SectionScore(props) {
  const { submissioner, suggestion, game, IsSubmittedCheck } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [expanded, setExpanded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const expandedIcon = useMemo(
    () => (!expanded ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expanded],
  );

  const validate = values => {
    const { scoreTeam1, scoreTeam2 } = values;
    const errors = {};
    if (scoreTeam1 < 0) {
      errors.scoreTeam1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (scoreTeam2 < 0) {
      errors.scoreTeam2 = t(ERROR_ENUM.VALUE_IS_INVALID);
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

      const score = {};
      score[submissioner.myRosterId] = scoreTeam1;
      score[submissioner.enemyRosterId] = scoreTeam2;

      const { status } = await api('/api/entity/suggestScore', {
        method: 'POST',
        body: JSON.stringify({
          game_id: game.id,
          submitted_by_roster: submissioner.myRosterId,
          submitted_by_person: submissioner.myEntityId,
          score: JSON.stringify(score),
        }),
      });

      if (status === STATUS_ENUM.SUCCESS) {
        submittedState(true);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('an_error_has_occured'),
          severity: SEVERITY_ENUM.INFO,
        });
      }
    },
  });

  console.log({ suggestion });

  const handleAcceptSuggestion = () => {
    console.log('accept');
  };
  const handleRefuseSuggestion = () => {
    console.log('refuse');
  };

  const submittedState = submitted => {
    setExpanded(!submitted);
    setIsSubmitted(submitted);
  };

  useEffect(() => {
    if (Boolean(suggestion?.score)) {
      submittedState(
        suggestion?.submitted_by_roster === submissioner.myRosterId,
      );
      formik.setFieldValue(
        'scoreTeam1',
        suggestion.score[submissioner.myRosterId],
      );
      formik.setFieldValue(
        'scoreTeam2',
        suggestion.score[submissioner.enemyRosterId],
      );
    }
    /*if (
      Boolean(
        suggestion?.submitted_by_roster === submissioner.myRosterId,
      )
    ) {
      submittedState(true);
      formik.setFieldValue(
        'scoreTeam1',
        suggestion.score[submissioner.myRosterId],
      );
      formik.setFieldValue(
        'scoreTeam2',
        suggestion.score[submissioner.enemyRosterId],
      );
    } else if (suggestion?.score) {
      formik.setFieldValue('scoreTeam1', )
    }*/
  }, [suggestion]);

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
        <div>
          {suggestion?.score &&
          suggestion.submitted_by_roster !==
            submissioner.myRosterId ? (
            <Typography className={styles.suggestedBy}>
              {'*' + t('suggested_by_the_other_team')}
            </Typography>
          ) : (
            <></>
          )}
          <div className={styles.scores}>
            <Typography className={styles.teamName}>{`${
              game.teams.find(
                t => t.roster_id === submissioner.myRosterId,
              ).name
            }: (${t('your_team')})`}</Typography>
            <TextField
              type="number"
              namespace="scoreTeam1"
              formik={formik}
              formikDisabled={isSubmitted || suggestion?.score}
            />
            <Typography className={styles.teamName}>{`${
              game.teams.find(
                t => t.roster_id === submissioner.enemyRosterId,
              ).name
            }:`}</Typography>
            <TextField
              type="number"
              namespace="scoreTeam2"
              formik={formik}
              formikDisabled={isSubmitted || suggestion?.score}
            />
          </div>

          {suggestion?.status === STATUS_ENUM.PENDING ? (
            <div className={styles.divSubmitScoreButton}>
              <div className={styles.acceptRefuseScore}>
                <IconButton
                  color="primary"
                  icon="CheckCircle"
                  fontSize="large"
                  style={{ color: '#18B393' }}
                  onClick={handleAcceptSuggestion}
                  tooltip={t('accept')}
                />
                <IconButton
                  color="secondary"
                  icon="Cancel"
                  fontSize="large"
                  style={{ color: '#f44336' }}
                  onClick={handleRefuseSuggestion}
                  tooltip={t('refuse')}
                />
              </div>
            </div>
          ) : (
            <div className={styles.divSubmitScoreButton}>
              <Button
                className={styles.submitButton}
                onClick={() => formik.handleSubmit()}
                color={'primary'}
                variant="text"
                disabled={isSubmitted || suggestion?.score}
              >
                {t('submit')}
              </Button>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}
