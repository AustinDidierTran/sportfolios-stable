import React, { useEffect } from 'react';
import { Button, TeamSearchList } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import TeamItem from '../../components/Custom/List/TeamItem';
import styles from './TeamSelect.module.css';

export default function TeamSelect(props) {
  const { t } = useTranslation();
  const { onClick, formik, eventId, onTeamChange } = props;
  const query = useFormInput('');

  const { team } = formik.values;

  useEffect(() => {
    if (team) {
      onClick();
    }
  }, [team]);

  const onChange = () => {
    formik.setFieldValue('team', null);
    onTeamChange();
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
        onClick={onClick}
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
