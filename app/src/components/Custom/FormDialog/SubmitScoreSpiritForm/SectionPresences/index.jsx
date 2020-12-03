import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Divider } from '@material-ui/core';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Collapse, IconButton, MultiSelect } from '../../..';
import { Typography } from '../../../../MUI';
import api from '../../../../../actions/api';
import AddPlayer from '../AddPlayer';
import { formatRoute } from '../../../../../actions/goTo';
import {
  PLAYER_ATTENDANCE_STATUS,
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../../Store';

import styles from '../SubmitScoreSpiritForm.module.css';

export default function SectionSpirit(props) {
  const {
    submittedAttendances,
    gameId,
    IsSubmittedCheck,
    submissionerInfos,
  } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [expanded, setExpanded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const expandedIcon = useMemo(
    () => (!expanded ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expanded],
  );

  const [addPlayer, setAddPlayer] = useState(false);
  const [fullRoster, setFullRoster] = useState([]);

  const getRoster = async () => {
    const { data } = await api(
      formatRoute('/api/entity/getRoster', null, {
        rosterId: submissionerInfos.myTeam.rosterId,
        withSub: true,
      }),
    );
    if (data) {
      const fullRoster = data
        .map(d => {
          if (d.isSub) {
            return {
              value: d.personId,
              display: `${d.name} (${t('sub')})`,
              isSub: true,
            };
          }
          return {
            value: d.personId,
            display: d.name,
            isSub: false,
          };
        })
        .sort((a, b) => a.isSub - b.isSub);

      setFullRoster(fullRoster);
    }
  };

  useEffect(() => {
    getRoster();
  }, [submissionerInfos?.myTeam]);

  useEffect(() => {
    if (submittedAttendances?.length) {
      formik.setFieldValue(
        'attendances',
        fullRoster.filter(r =>
          submittedAttendances.some(a => a.value === r.value),
        ),
      );
      submittedState(true);
    } else if (fullRoster.length) {
      formik.setFieldValue(
        'attendances',
        fullRoster.filter(p => !p.isSub),
      );
    }
  }, [fullRoster]);

  const updateRoster = player => {
    let name = player.completeName || player.name;
    if (player.is_sub) {
      name += ` (${t('sub')})`;
    }

    const newPerson = {
      display: name,
      value: player.person_id || player.id,
      isSub: player.is_sub,
    };

    setFullRoster([...fullRoster, newPerson]);

    formik.setFieldValue(
      'attendances',
      formik.values.attendances.concat([newPerson]),
    );
  };

  const formik = useFormik({
    initialValues: {
      attendances: [],
    },
    onSubmit: async values => {
      const { attendances } = values;

      const attendancesToSend = fullRoster
        .map(p => ({
          ...p,
          status: attendances.some(a => a.value === p.value)
            ? PLAYER_ATTENDANCE_STATUS.PRESENT
            : PLAYER_ATTENDANCE_STATUS.ABSENT,
        }))
        .filter(
          p =>
            !(
              p.status === PLAYER_ATTENDANCE_STATUS.ABSENT && p.isSub
            ),
        );

      const { status } = await api('/api/entity/gameAttendances', {
        method: 'POST',
        body: JSON.stringify({
          gameId,
          rosterId: submissionerInfos.myTeam.rosterId,
          editedBy: submissionerInfos.person.entityId,
          attendances: attendancesToSend,
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

  const submittedState = submitted => {
    setExpanded(!submitted);
    setIsSubmitted(submitted);
  };

  const handleAttendancesChange = value => {
    formik.setFieldValue('attendances', value);
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
        <div className={styles.attendances}>
          <MultiSelect
            label={t('attendances')}
            options={fullRoster}
            values={formik.values.attendances}
            onChange={handleAttendancesChange}
          />
        </div>
        <Button
          className={styles.addSubButton}
          endIcon="Add"
          onClick={() => setAddPlayer(true)}
        >
          {t('add_sub')}
        </Button>
        <AddPlayer
          open={addPlayer}
          onClose={() => setAddPlayer(false)}
          rosterId={submissionerInfos.myTeam.rosterId}
          fullRoster={fullRoster}
          updateRoster={updateRoster}
        />
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
      </Collapse>
    </div>
  );
}
