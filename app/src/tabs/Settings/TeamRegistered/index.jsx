import React, { useContext, useEffect, useState } from 'react';

import { Paper } from '../../../components/MUI';
import { Store, SCREENSIZE_ENUM } from '../../../Store';
import PaymentChip from './PaymentChip';
import RosterChip from './RosterChip';

import { withStyles, makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function TeamRegistered() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();

  const classes = useStyles;

  const [teams, setTeams] = useState([]);

  const {
    state: { screenSize },
  } = useContext(Store);

  const [isMobile, setIsMobile] = useState(
    screenSize === SCREENSIZE_ENUM.xs,
  );

  useEffect(() => {
    if (screenSize === SCREENSIZE_ENUM.xs) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [screenSize]);

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

  // const teams = [
  //   {
  //     name: 'Sherbrooke Gentlemens Club',
  //     captain: 'Vincent Sasseville',
  //     rosterIsValid: true,
  //     paymentDue: 0,
  //   },
  //   {
  //     name: 'Manic',
  //     captain: 'Elliot Heloir',
  //     rosterIsValid: true,
  //     paymentDue: 300,
  //   },
  //   {
  //     name: 'Magma',
  //     captain: 'Cedric Aubut-Boucher',
  //     rosterIsValid: false,
  //     paymentDue: 0,
  //   },
  //   {
  //     name: 'Mesa',
  //     captain: 'Christian Painchaud',
  //     rosterIsValid: false,
  //     paymentDue: 345,
  //   },
  //   {
  //     name: 'Quake',
  //     captain: 'Francis Vallée',
  //     rosterIsValid: true,
  //     paymentDue: 245,
  //   },
  //   {
  //     name: 'Quartz',
  //     captain: 'Joseph Genest',
  //     rosterIsValid: true,
  //     paymentDue: 0,
  //   },
  // ];
  const numberOfTeams = {
    title: t('registration_status'),
    description: '6/16 inscrits',
  };

  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      minWidth: 25,
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
        <Table
          className={classes.table}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              {isMobile ? (
                <StyledTableCell>
                  {numberOfTeams.title}:
                </StyledTableCell>
              ) : (
                <StyledTableCell>
                  {numberOfTeams.title}:&nbsp;
                  {numberOfTeams.description}
                </StyledTableCell>
              )}
              {isMobile ? (
                <StyledTableCell>
                  {numberOfTeams.description}
                </StyledTableCell>
              ) : (
                <></> //<StyledTableCell />
              )}
              {isMobile ? <></> : <StyledTableCell />}
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('team')}</StyledTableCell>
              {isMobile ? (
                <StyledTableCell align="center">
                  {t('state')}
                </StyledTableCell>
              ) : (
                <></>
                // <StyledTableCell align="center">
                //   {t('roster')}
                // </StyledTableCell>
              )}
              {isMobile ? (
                <></>
              ) : (
                <StyledTableCell align="center">
                  {t('status')}
                </StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map(team => (
              <StyledTableRow key={team.name}>
                <StyledTableCell component="th" scope="row">
                  {team.name}
                </StyledTableCell>
                {isMobile ? (
                  <StyledTableCell align="center">
                    <PaymentChip
                      state={team.paymentDue}
                      mobile={isMobile}
                    />
                    <RosterChip state={team.rosterIsValid} />
                  </StyledTableCell>
                ) : (
                  <></>
                  // <StyledTableCell align="center">
                  //   <RosterChip state={team.rosterIsValid} />
                  // </StyledTableCell>
                )}
                {isMobile ? (
                  <></>
                ) : (
                  <StyledTableCell align="center">
                    <PaymentChip
                      state={team.status}
                      mobile={isMobile}
                    />
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
