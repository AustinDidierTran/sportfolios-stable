import React, { useEffect, useState } from 'react';

import {
  Paper,
  MailToButton,
  Dialog,
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
import { unregister } from '../../../actions/api/helpers';
import { IconButton } from '../../../components/Custom';
import { formatPrice } from '../../../utils/stringFormats';

export default function TeamRegistered() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();

  const [teams, setTeams] = useState([]);
  const [maximumSpots, setMaximumSpots] = useState();
  const [open, setOpen] = useState(false);
  const [rosterId, setRosterId] = useState(null);

  const onClose = () => {
    setOpen(false);
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

  const handleClick = rosterId => {
    setOpen(true);
    setRosterId(rosterId);
  };

  const onUnregisterTeam = async () => {
    const { data } = await unregister({
      eventId,
      rosterId,
    });
    setTeams(data);
    setOpen(false);
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

  const buttons = [
    {
      title: t('yes'),
      onClick: onUnregisterTeam,
    },
    {
      title: t('no'),
      onClick: onClose,
    },
  ];

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
              <StyledTableCell />
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
                        onClick={() => handleClick(team.rosterId)}
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
                <StyledTableCell />
                <StyledTableCell />
                <StyledTableCell />
                <StyledTableCell />
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        description={t(
          'are_you_sure_you_want_to_unregister_this_team',
        )}
        onClose={onClose}
        open={open}
        buttons={buttons}
      ></Dialog>
    </Paper>
  );
}
