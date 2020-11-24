import React, { useState, useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { Button, TeamSearchList } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import TeamItem from '../../components/Custom/List/TeamItem';
import styles from './TeamSelect.module.css';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';

export default function TeamSelect(props) {
  const { t } = useTranslation();
  const { onClick, formik, eventId, onTeamChange } = props;
  const query = useFormInput('');

  const { team } = formik.values;
  const [whiteList, setWhiteList] = useState([]);

  /*const getExistingTeamIfItExists = async () => {
    if (team.id) {
      const { data } = await api(
        formatRoute('/api/entity/registered', null, {
          team_id: team.id,
          event_id: eventId,
        }),
      );
      const {
        data: { basicInfos: theTeam },
      } = await api(
        formatRoute('/api/entity', null, {
          id: team.id,
        }),
      );
      if (data.length < 1) {
        formik.setFieldValue('team', theTeam);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('team_already_registered'),
          severity: SEVERITY_ENUM.ERROR,
          vertical: POSITION_ENUM.TOP,
        });
      }
    }
  };*/

  useEffect(() => {
    if (team) {
      //   getExistingTeamIfItExists();
      onClick();
    }
  }, [team]);

  useEffect(() => {
    getWhiteList();
  }, [eventId]);

  const onChange = () => {
    formik.setFieldValue('team', null);
    onTeamChange();
  };

  const getWhiteList = async () => {
    const { data: owned } = await api(
      formatRoute('/api/entity/allOwned', null, {
        type: GLOBAL_ENUM.TEAM,
      }),
    );
    const { data: registered } = await api(
      formatRoute('/api/entity/allTeamsRegisteredInfos', null, {
        eventId,
      }),
    );

    const registeredIds = registered.map(r => r.teamId);

    const isIncluded = id => {
      return !registeredIds.find(teamId => teamId === id);
    };

    const entities = owned.filter(o => {
      return isIncluded(o.id);
    });
    setWhiteList(entities.map(e => e.id));
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
        whiteList={whiteList}
        autoFocus
        formik={formik}
      />
    </div>
  );
}
