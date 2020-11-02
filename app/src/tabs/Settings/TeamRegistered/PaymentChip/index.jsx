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

  if (
    status === INVOICE_STATUS_ENUM.PAID ||
    status === INVOICE_STATUS_ENUM.FREE
  ) {
    return (
      <div className={classes.root}>
        <Chip
          label={t(status)}
          icon={<AttachMoney />}
          color="primary"
          variant="outlined"
        />
      </div>
    );
  }

  if (status === INVOICE_STATUS_ENUM.REFUNDED) {
    return (
      <div className={classes.root}>
        <Chip
          label={t('refunded')}
          icon={<AttachMoney />}
          color="secondary"
          variant="outlined"
        />
      </div>
    );
  }

  if (mobile) {
    return <></>;
  }

  return (
    <div className={classes.root}>
      <Chip
        label={t('not_paid')}
        icon={<AttachMoney />}
        color="secondary"
        variant="outlined"
      />
    </div>
  );
}
