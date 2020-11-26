import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Collapse,
  Icon,
  IconButton,
  MultiSelect,
} from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { TextField, Typography } from '../../../MUI';
import { ERROR_ENUM } from '../../../../../../common/errors';

import styles from './SubmitScoreSpiritForm.module.css';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';

export default function SubmitScoreDialog(props) {
  const { open, onClose, game } = props;
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
      spirit: [2, 2, 2, 2, 2],
      comments: '',
      rosterPresencesOptions: [],
      rosterPresences: [],
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {},
  });

  const [expandedScore, setExpandedScore] = useState(true);
  const [expandedSpirit, setExpandedSpirit] = useState(true);
  const [expandedPresences, setExpandedPresences] = useState(true);

  const [isSubmittedScore, setIsSubmittedScore] = useState(false);
  const [isSubmittedSpirit, setIsSubmittedSpirit] = useState(false);
  const [isSubmittedPresences, setIsSubmittedPresences] = useState(
    false,
  );

  const expandedIconScore = useMemo(
    () => (!expandedScore ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expandedScore],
  );
  const expandedIconSpirit = useMemo(
    () => (!expandedSpirit ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expandedSpirit],
  );
  const expandedIconPresences = useMemo(
    () =>
      !expandedPresences ? 'KeyboardArrowDown' : 'KeyboardArrowUp',
    [expandedPresences],
  );

  const spiritTotal = useMemo(
    () => formik.values.spirit.reduce((a, b) => a + b, 0),
    [formik.values.spirit],
  );

  const onSubmitScore = () => {
    console.log('submitting score');
    setExpandedScore(false);
    setIsSubmittedScore(true);
  };

  const onSubmitSpirit = () => {
    console.log('submitting spirit');
    setExpandedSpirit(false);
    setIsSubmittedSpirit(true);
  };

  const onSubmitPresences = () => {
    console.log('submitting presences');
    setExpandedPresences(false);
    setIsSubmittedPresences(true);
  };

  const handleRadioChange = event => {
    console.log(event.target);
    formik.setFieldValue(
      `spirit[${event.target.name}]`,
      Number(event.target.value),
    );
  };

  const handleRosterPresencesChange = e => {
    console.log(e);
  };

  const Submitted = (
    <div className={styles.submitted}>
      <Typography className={styles.submitText}>
        {t('submitted')}
      </Typography>
      <Icon icon="CheckCircleOutline" color="#54AF51" />
    </div>
  );

  const spiritCategories = [
    'rules_knowledge_and_use',
    'fouls_and_body_contact',
    'fair_mindedness',
    'positive_attitude_and_self_control',
    'communication',
  ];
  const RadioButtons = Array(5)
    .fill(0)
    .map((_, indexCategory) => (
      <FormControl
        className={styles.radioGroup}
        component="fieldset"
        key={indexCategory}
        size="small"
        fullWidth
      >
        <FormLabel component="legend">
          {`${indexCategory}. ${t(spiritCategories[indexCategory])}`}
        </FormLabel>
        <RadioGroup
          row
          name={indexCategory}
          onChange={handleRadioChange}
          value={formik.values.spirit[indexCategory]}
        >
          {Array(5)
            .fill(0)
            .map((_, indexRadioButton) => (
              <FormControlLabel
                className={styles.radioGroupControlLabel}
                key={indexRadioButton}
                value={indexRadioButton}
                control={
                  <Radio
                    color="primary"
                    size="small"
                    disabled={isSubmittedSpirit}
                  />
                }
                label={indexRadioButton}
                labelPlacement="bottom"
              />
            ))}
        </RadioGroup>
      </FormControl>
    ));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth={'xs'}
      fullWidth
    >
      <DialogTitle id="form-dialog-title">
        {t('submit_score')}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <DialogContent>
            {/*SCORE*/}
            <div
              className={styles.collapseHeader}
              onClick={() => setExpandedScore(!expandedScore)}
            >
              <Typography>{t('score')}</Typography>
              <div className={styles.expand}>
                {isSubmittedScore ? Submitted : <></>}
                <IconButton
                  className={styles.arrowButton}
                  aria-expanded={expandedScore}
                  icon={expandedIconScore}
                  style={{
                    color: 'primary',
                  }}
                />
              </div>
            </div>
            <Divider />
            <Collapse in={expandedScore} timeout="auto" unmountOnExit>
              <Typography
                className={styles.teamName}
              >{`${game.teams[0].name}:`}</Typography>
              <TextField
                type="number"
                namespace="scoreTeam1"
                formik={formik}
                formikDisabled={isSubmittedScore}
              />
              <Typography
                className={styles.teamName}
              >{`${game.teams[1].name}:`}</Typography>
              <TextField
                type="number"
                namespace="scoreTeam2"
                formik={formik}
                formikDisabled={isSubmittedScore}
              />
              <div className={styles.divSubmitButton}>
                <Button
                  className={styles.submitButton}
                  onClick={onSubmitScore}
                  color={'primary'}
                  variant="text"
                  disabled={isSubmittedScore}
                >
                  {t('submit')}
                </Button>
              </div>
            </Collapse>

            {/*SPIRIT*/}
            <div
              className={styles.collapseHeader}
              onClick={() => setExpandedSpirit(!expandedSpirit)}
            >
              <Typography>{t('spirit')}</Typography>
              <div className={styles.expand}>
                {isSubmittedSpirit ? Submitted : <></>}
                <IconButton
                  className={styles.arrowButton}
                  aria-expanded={expandedSpirit}
                  icon={expandedIconSpirit}
                  style={{ color: 'primary' }}
                />
              </div>
            </div>
            <Divider />
            <Collapse
              in={expandedSpirit}
              timeout="auto"
              unmountOnExit
            >
              <Typography
                className={styles.spiritChart}
                color="textSecondary"
              >
                {t('spirit_chart_ligue_mardi')}
              </Typography>
              {RadioButtons}
              <Typography
                className={styles.totalSpirit}
              >{`Total: ${spiritTotal}`}</Typography>
              <TextField
                type="text"
                namespace="comments"
                placeholder={t('comments')}
                formik={formik}
                fullWidth
                formikDisabled={isSubmittedSpirit}
              />
              <div className={styles.divSubmitButton}>
                <Button
                  className={styles.submitButton}
                  onClick={onSubmitSpirit}
                  color={'primary'}
                  variant="text"
                  disabled={isSubmittedSpirit}
                >
                  {t('submit')}
                </Button>
              </div>
            </Collapse>

            {/*PRESENCES*/}
            <div
              className={styles.collapseHeader}
              onClick={() => setExpandedPresences(!expandedPresences)}
            >
              <Typography>{t('roster')}</Typography>
              <div className={styles.expand}>
                {isSubmittedPresences ? Submitted : <></>}
                <IconButton
                  className={styles.arrowButton}
                  aria-expanded={expandedPresences}
                  icon={expandedIconPresences}
                  style={{ color: 'primary' }}
                />
              </div>
            </div>
            <Divider />
            <Collapse
              in={expandedPresences}
              timeout="auto"
              unmountOnExit
            >
              <MultiSelect
                values={formik.values.rosterPresences}
                onChange={handleRosterPresencesChange}
                options={formik.values.rosterPresencesOptions}
                disabled={isSubmittedPresences}
              />
              <div className={styles.divSubmitButton}>
                <Button
                  className={styles.submitButton}
                  onClick={onSubmitPresences}
                  color={'primary'}
                  variant="text"
                  disabled={isSubmittedPresences}
                >
                  {t('submit')}
                </Button>
              </div>
            </Collapse>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              {t('cancel')}
            </Button>
            <Button onClick="submit" color="primary">
              {t('done')}
            </Button>
          </DialogActions>
        </div>
      </form>
    </Dialog>
  );
}
