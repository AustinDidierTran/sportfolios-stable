import React, { useEffect, useState } from 'react';

import { Paper, MailToButton } from '../../../components/Custom';
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

export default function TeamRegistered() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();

  const [teams, setTeams] = useState([]);
  const [maximumSpots, setMaximumSpots] = useState();

  const getTeams = async () => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsRegistered', null, {
        eventId,
      }),
    );
    setTeams(data);
  };

  useEffect(() => {
    getTeams();
  }, [eventId]);

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
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('team')}</StyledTableCell>
              <StyledTableCell align="center">
                {t('status')}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t('contact')}
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
                    <StyledTableCell align="center">
                      <PaymentChip status={team.status} />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <MailToButton emails={team.emails} />
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
    </Paper>
  );
}
