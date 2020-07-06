import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import AttachMoney from '@material-ui/icons/AttachMoney';
import { INVOICE_STATUS_ENUM } from '../../../../../../common/enums';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function PaymentChips(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { status, mobile } = props;

  return (
    <div className={classes.root}>
      {status === INVOICE_STATUS_ENUM.PAID ? (
        <Chip
          label={t('paid')}
          icon={<AttachMoney />}
          color="primary"
          variant="outlined"
        />
      ) : mobile ? (
        <></>
      ) : (
        <Chip
          label={t('not_paid')}
          icon={<AttachMoney />}
          color="secondary"
          variant="outlined"
        />
      )}
    </div>
  );
}
