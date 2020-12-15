import React, { useEffect } from 'react';
import { Button, TeamSearchList } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import TeamItem from '../../../components/Custom/List/TeamItem';
import styles from './TeamSelect.module.css';
import { useParams } from 'react-router-dom';

export default function TeamSelect(props) {
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const { stepHook, formik } = props;
  const query = useFormInput('');

  const { team } = formik.values;

  useEffect(() => {
    if (team) {
      stepHook.handleCompleted(1);
    }
  }, [team]);

  const handleClick = e => {
    formik.setFieldValue('team', {
      id: undefined,
      name: e.target.value,
    });
    stepHook.handleCompleted(1);
  };

  const onChange = () => {
    formik.setFieldValue('team', null);
    stepHook.handleNotCompleted(1);
  };

  if (team) {
    return (
      <div className={styles.main}>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          style={{ marginBottom: '8px' }}
        >
          {t(
            'you_can_always_change_your_team_name_in_your_team_profile',
          )}
        </Typography>
        <TeamItem
          {...team}
          secondary="Selected Team"
          className={styles.main}
          notClickable
        />

        <Button
          className={styles.item}
          size="small"
          variant="contained"
          endIcon="Undo"
          style={{ margin: '8px' }}
          onClick={onChange}
        >
          {t('change_team')}
        </Button>
      </div>
    );
  }
  return (
    <div className={styles.main}>
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        style={{ marginBottom: '8px' }}
      >
        {t(
          'you_can_always_change_your_team_name_in_your_team_profile',
        )}
      </Typography>
      <TeamSearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_team_name')}
        onClick={handleClick}
        query={query}
        allowCreate
        withoutIcon
        autoFocus
        formik={formik}
        eventId={eventId}
      />
    </div>
  );
}
