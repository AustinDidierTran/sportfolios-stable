import React, { useMemo, useState } from 'react';
import { Divider } from '@material-ui/core';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Collapse, IconButton, MultiSelect } from '../../..';
import { Typography } from '../../../../MUI';

import styles from '../SubmitScoreSpiritForm.module.css';

export default function SectionSpirit(props) {
  const {
    submissioner,
    submittedPresences,
    game,
    IsSubmittedCheck,
  } = props;
  const { t } = useTranslation();

  const [
    rosterPresencesOptions,
    setrosterPresencesOptions,
  ] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const expandedIcon = useMemo(
    () => (!expanded ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expanded],
  );

  const formik = useFormik({
    initialValues: {
      rosterPresences: [],
    },
    //validate,
    //validateOnChange: false,
    //validateOnBlur: false,
    onSubmit: async values => {},
  });

  const onSubmitPresences = () => {
    console.log('submitting presences');
    setExpanded(false);
    setIsSubmitted(true);
  };

  const handleRosterPresencesChange = e => {
    console.log(e);
  };

  return (
    <div>
      <div
        className={styles.collapseHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography>{t('roster')}</Typography>
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
        <MultiSelect
          values={formik.values.rosterPresences}
          onChange={handleRosterPresencesChange}
          options={rosterPresencesOptions}
          disabled={isSubmitted}
        />
        <div className={styles.divSubmitButton}>
          <Button
            className={styles.submitButton}
            onClick={onSubmitPresences}
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
