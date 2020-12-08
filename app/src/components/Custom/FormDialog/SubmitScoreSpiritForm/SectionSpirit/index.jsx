import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Collapse, IconButton } from '../../..';
import { TextField, Typography } from '../../../../MUI';
import {
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../../Store';
import api from '../../../../../actions/api';
import styles from '../SubmitScoreSpiritForm.module.css';

export default function SectionSpirit(props) {
  const {
    submittedSpirit,
    gameId,
    IsSubmittedCheck,
    submissionerInfos,
  } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const formik = useFormik({
    initialValues: {
      spirit: [2, 2, 2, 2, 2],
      comment: '',
    },
    onSubmit: async values => {
      const { spirit, comment } = values;

      const { status } = await api('/api/entity/spirit', {
        method: 'POST',
        body: JSON.stringify({
          submitted_by_roster: submissionerInfos.myTeam.rosterId,
          submitted_by_person: submissionerInfos.person.entityId,
          game_id: gameId,
          submitted_for_roster: submissionerInfos.enemyTeam.rosterId,
          spirit_score: spirit.reduce((a, b) => a + b, 0),
          comment,
        }),
      });

      if (status === STATUS_ENUM.SUCCESS) {
        submittedState(true);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('an_error_has_occured'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  });

  const [expanded, setExpanded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(true);
  const expandedIcon = useMemo(
    () => (!expanded ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expanded],
  );
  const spiritTotal = useMemo(
    () => formik.values.spirit.reduce((a, b) => a + b, 0),
    [formik.values.spirit],
  );

  useEffect(() => {
    submittedState(Boolean(submittedSpirit?.spirit_score));
  }, [submittedSpirit]);

  const submittedState = submitted => {
    setExpanded(!submitted);
    setIsSubmitted(submitted);
  };

  const handleRadioChange = event => {
    formik.setFieldValue(
      `spirit[${event.target.name.substring(1)}]`,
      Number(event.target.value),
    );
  };

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
      >
        <FormLabel component="legend">
          {`${indexCategory + 1}. ${t(
            spiritCategories[indexCategory],
          )}`}
        </FormLabel>
        <RadioGroup
          className={styles.radioGroupContainer}
          row
          name={`r${indexCategory}`}
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
                    disabled={isSubmitted}
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
    <div>
      <div
        className={styles.collapseHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography>{t('spirit')}</Typography>
        <div className={styles.expand}>
          {isSubmitted ? IsSubmittedCheck : <></>}
          <IconButton
            className={styles.arrowButton}
            aria-expanded={expanded}
            icon={expandedIcon}
            style={{ color: 'primary' }}
          />
        </div>
      </div>
      <Divider />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {isSubmitted ? (
          <div>
            <Typography
              className={styles.totalSpirit}
            >{`Total: ${submittedSpirit?.spirit_score ||
              spiritTotal}`}</Typography>
            {formik.values.comment ? (
              <TextField
                type="text"
                value={submittedSpirit?.comment}
                fullWidth
                formikDisabled
              />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div>
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
              namespace="comment"
              placeholder={t('comments')}
              formik={formik}
              fullWidth
            />
          </div>
        )}
        {!isSubmitted ? (
          <div className={styles.divSubmitButton}>
            <Button
              className={styles.submitButton}
              onClick={() => formik.handleSubmit()}
              color={'primary'}
              variant="text"
            >
              {t('submit')}
            </Button>
          </div>
        ) : (
          <></>
        )}
      </Collapse>
    </div>
  );
}
