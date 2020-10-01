import React, { useEffect, useState, useContext } from 'react';

import {
  Paper,
  MailToButton,
  AlertDialog,
  IconButton,
} from '../../../components/Custom';
import PaymentChip from './PaymentChip';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import styles from './TeamRegistered.module.css';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { unregisterTeams } from '../../../actions/api/helpers';
import { formatPrice } from '../../../utils/stringFormats';
import { SEVERITY_ENUM } from '../../../../../common/enums';
import { Store, ACTION_ENUM } from '../../../Store';

export default function TeamRegistered() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const { dispatch } = useContext(Store);

  const [teams, setTeams] = useState([]);
  const [
    teamsThatCanBeUnregistered,
    setTeamsThatCanBeUnregistered,
  ] = useState([]);
  const [maximumSpots, setMaximumSpots] = useState();
  const [openUnregister, setOpenUnregister] = useState(false);
  const [openUnregisterAll, setOpenUnregisterAll] = useState(false);
  const [rosterId, setRosterId] = useState(null);

  const onCloseUnregister = () => {
    setOpenUnregister(false);
  };

  const onCloseUnregisterAll = () => {
    setOpenUnregisterAll(false);
  };

  const getTeams = async () => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsRegisteredInfos', null, {
        eventId,
      }),
    );
    setTeams(data);
  };

  useEffect(() => {
    getTeams();
  }, [eventId]);

  const getCanUnregisterTeamsList = async rosterIds => {
    const { data } = await api(
      formatRoute('/api/entity/canUnregisterTeamsList', null, {
        eventId,
        rosterIds: JSON.stringify(rosterIds),
      }),
    );

    return data;
  };

  const handleUnregisterClick = async rosterId => {
    setRosterId(rosterId);
    const data = await getCanUnregisterTeamsList([rosterId]);

    if (data.length) {
      setOpenUnregister(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('this_team_cannot_be_deleted'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  const handleUnregisterAllClick = async () => {
    const data = await getCanUnregisterTeamsList(
      teams.map(t => t.rosterId),
    );

    setTeamsThatCanBeUnregistered(data);

    if (data.length) {
      setOpenUnregisterAll(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_unregister_any_teams'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  const onUnregisterTeam = async () => {
    const res = await unregisterTeams({
      eventId,
      rosterIds: [rosterId],
    });

    /*if (res.status === 403) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('this_team_cannot_be_deleted'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }*/

    setTeams(res.data);
    setOpenUnregister(false);
  };

  const onUnregisterAll = async () => {
    const res = await unregisterTeams({
      eventId,
      rosterIds: teamsThatCanBeUnregistered,
    });

    /*if (res.status === 403) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('some_teams_cannot_be_deleted'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }*/

    setTeams(res.data);
    setOpenUnregisterAll(false);
  };

  const getMaximumSpots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/event', null, {
        eventId,
      }),
    );
    setMaximumSpots(data.maximum_spots);
  };

  useEffect(() => {
    getMaximumSpots();
  }, [teams]);

  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      maxWidth: 55,
    },
  }))(TableCell);

  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  return (
    <Paper className={styles.paper}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {maximumSpots ? (
                <StyledTableCell>
                  {t('registration_status')}:&nbsp;
                  {teams.length}/{maximumSpots}&nbsp;
                  {t('registered')}
                </StyledTableCell>
              ) : (
                <StyledTableCell>
                  {t('registration_status')}:&nbsp;
                  {teams.length}&nbsp;
                  {t('registered')}
                </StyledTableCell>
              )}
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell align="center">
                {teams.length > 0 ? (
                  <IconButton
                    //color="primary"
                    variant="contained"
                    icon="MoneyOff"
                    tooltip={t('unregister_all')}
                    onClick={() => handleUnregisterAllClick()}
                    style={{ color: '#f44336' }}
                  />
                ) : (
                  <></>
                )}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('team')}</StyledTableCell>
              <StyledTableCell>{t('captain')}</StyledTableCell>
              <StyledTableCell>{t('option')}</StyledTableCell>
              <StyledTableCell align="center">
                {t('status')}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t('actions')}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.length > 0 ? (
              <>
                {teams.map(team => (
                  <StyledTableRow key={team.name}>
                    <StyledTableCell component="th" scope="row">
                      {team.name}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {team.captains[0].name}&nbsp;
                      {team.captains[0].surname}
                    </StyledTableCell>
                    {team.option ? (
                      <StyledTableCell component="th" scope="row">
                        {team.option.name}&nbsp;
                        {formatPrice(team.option.price)}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell component="th" scope="row">
                        {t('no_option')}
                      </StyledTableCell>
                    )}

                    <StyledTableCell align="center">
                      <PaymentChip status={team.status} />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <MailToButton emails={team.emails} />
                      <IconButton
                        color="primary"
                        variant="contained"
                        icon="MoneyOff"
                        tooltip={t('unregister')}
                        onClick={() =>
                          handleUnregisterClick(team.rosterId)
                        }
                        style={{ color: '#18b393' }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </>
            ) : (
              <StyledTableRow align="center">
                <StyledTableCell>
                  {t('no_teams_registered')}
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AlertDialog
        open={openUnregister}
        onCancel={onCloseUnregister}
        onSubmit={onUnregisterTeam}
        title={t('are_you_sure_you_want_to_unregister_this_team')}
        description={teams.find(x => x.rosterId === rosterId)?.name}
      />
      <AlertDialog
        open={openUnregisterAll}
        onCancel={onCloseUnregisterAll}
        onSubmit={onUnregisterAll}
        title={
          teamsThatCanBeUnregistered.length < teams.length
            ? t('cant_unregister_all_teams', {
                howManyCanUnregister:
                  teamsThatCanBeUnregistered.length,
                totalOfTeams: teams.length,
              })
            : t('are_you_sure_you_want_to_unregister_all_teams')
        }
        description={teamsThatCanBeUnregistered
          .map(function(rosterId) {
            return teams.find(x => x.rosterId === rosterId)?.name;
          })
          .join(', ')}
      />
    </Paper>
  );
}
