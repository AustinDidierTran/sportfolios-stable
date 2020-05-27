import React, { useContext, useEffect, useState } from 'react';

import { Paper } from '../../../components/MUI';
import { Store, SCREENSIZE_ENUM } from '../../../Store';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import styles from './Admin.module.css';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function Ranking(props) {
  const { t } = useTranslation();

  const classes = useStyles;

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

  const teams = [
    {
      name: 'Sherbrooke Gentlemens Club',
      captain: 'Vincent Sasseville',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
    {
      name: 'Manic',
      captain: 'Elliot Heloir',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
    {
      name: 'Magma',
      captain: 'Cedric Aubut-Boucher',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
    {
      name: 'Mesa',
      captain: 'Christian Painchaud',
      rosterIsValid: 'Alignement non-conforme',
      paymentDue: 0,
    },
    {
      name: 'Quake',
      captain: 'Francis Vallée',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
    {
      name: 'Quartz',
      captain: 'Joseph Genest',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
  ];
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
      minWidth: 95,
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
                <StyledTableCell />
              )}
              <StyledTableCell />
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <StyledTableCell>Nom de l'équipe</StyledTableCell>
              <StyledTableCell align="right">
                Nom du capitaine
              </StyledTableCell>
              <StyledTableCell align="right">
                Conformité de l'alignement
              </StyledTableCell>
              <StyledTableCell align="right">
                Solde a payer
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map(team => (
              <StyledTableRow key={team.name}>
                <StyledTableCell component="th" scope="row">
                  {team.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {team.captain}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {team.rosterIsValid}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {team.paymentDue}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
