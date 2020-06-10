import React from 'react';

import { Paper, Button } from '../../../../components/Custom';
import { Typography } from '../../../../components/MUI';
import { Store, SCREENSIZE_ENUM } from '../../../../Store';
import styles from './ManageRoles.module.css';
import { useTranslation } from 'react-i18next';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import PaymentChip from '../../../Event/Admin/PaymentChip';
import RosterChip from '../../../Event/Admin/RosterChip';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function ManageRoles(props) {
  const { t } = useTranslation();

  const classes = useStyles;

  const persons = [
    { name: 'Julien' },
    { name: 'Alexandre' },
    { name: 'Didier' },
  ];

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
    <Paper className={styles.card}>
      {/* <Typography variant="h3" className={styles.title}>
        {t('admins')}
      </Typography>
      <Button
        onClick={() => {}}
        className={styles.button}
        endIcon="Add"
      >
        {t('add_admin')}
      </Button>
      <Button
        onClick={() => {}}
        className={styles.button}
        endIcon="Add"
      >
        {t('add_editor')}
      </Button> */}
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('admins')}</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {persons.map(team => (
              <StyledTableRow key={team.name}>
                <StyledTableCell component="th" scope="row">
                  {team.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <RosterChip state={team.rosterIsValid} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
