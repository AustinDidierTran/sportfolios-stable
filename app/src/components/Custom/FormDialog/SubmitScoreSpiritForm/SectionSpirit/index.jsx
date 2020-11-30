import React, { useMemo, useState } from 'react';
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

import styles from '../SubmitScoreSpiritForm.module.css';

export default function SectionSpirit(props) {
  const { spiritSubmission, game, IsSubmittedCheck } = props;
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      spirit: [2, 2, 2, 2, 2],
      comments: '',
    },
    //validate,
    //validateOnChange: false,
    //validateOnBlur: false,
    onSubmit: async values => {},
  });

  const [expanded, setExpanded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(
    Boolean(spiritSubmission),
  );
  const expandedIcon = useMemo(
    () => (!expanded ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expanded],
  );
  const spiritTotal = useMemo(
    () => formik.values.spirit.reduce((a, b) => a + b, 0),
    [formik.values.spirit],
  );

  const onSubmitSpirit = () => {
    console.log('submitting spirit');
    setExpanded(false);
    setIsSubmitted(true);
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
        fullWidth
      >
        <FormLabel component="legend">
          {`${indexCategory + 1}. ${t(
            spiritCategories[indexCategory],
          )}`}
        </FormLabel>
        <RadioGroup
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
            <Typography>{`Total: ${spiritSubmission?.spirit_score}`}</Typography>
            <TextField
              type="text"
              disabled
              value={spiritSubmission?.comment}
              fullWidth
            />
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
          </div>
        )}
        <Typography
          className={styles.totalSpirit}
        >{`Total: ${spiritTotal}`}</Typography>
        <TextField
          type="text"
          namespace="comments"
          placeholder={t('comments')}
          formik={formik}
          fullWidth
        />
        <div className={styles.divSubmitButton}>
          <Button
            className={styles.submitButton}
            onClick={onSubmitSpirit}
            color={'primary'}
            variant="text"
            disabled={isSubmitted}
          >
            {t('submit')}
          </Button>
        </div>
      </Collapse>
    </div>
  );
}
