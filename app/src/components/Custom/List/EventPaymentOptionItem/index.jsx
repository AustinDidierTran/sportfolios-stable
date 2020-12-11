import React, { useState, useContext, useMemo } from 'react';
import { ListItem, ListItemText } from '../../../MUI';
import { FormDialog, IconButton, AlertDialog } from '../../../Custom';
import { Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  formatDate,
  formatPrice,
} from '../../../../utils/stringFormats';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../Store';
import {
  FORM_DIALOG_TYPE_ENUM,
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../common/enums';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import CollapsePaymentOption from './CollapsePaymentOption';

export default function EventPaymentOptionItem(props) {
  const { t } = useTranslation();
  const { option, update } = props;
  const {
    id,
    name,
    team_price,
    individual_price,
    startTime,
    endTime,
    owner,
    taxRates,
    team_activity,
  } = option;

  const { dispatch } = useContext(Store);
  const [alertDialog, setAlertDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const icon = useMemo(
    () => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'),
    [expanded],
  );

  const onDelete = async () => {
    await api(formatRoute('/api/entity/option', null, { id }), {
      method: 'DELETE',
    });
    update();
    setAlertDialog(false);
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const editOptionEvent = async values => {
    const { openDate, openTime, closeDate, closeTime } = values;

    const start = new Date(`${openDate} ${openTime}`).getTime();
    const end = new Date(`${closeDate} ${closeTime}`).getTime();

    const res = await api('/api/entity/updateOption', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        startTime: start,
        endTime: end,
      }),
    });

    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('changes_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }
    update();
  };

  return (
    <div>
      <ListItem onClick={handleExpand}>
        <ListItemText
          primary={`${name} | ${t('price_team')} ${
            team_price === 0 ? t('free') : formatPrice(team_price)
          }, ${t('price_individual')} ${
            individual_price === 0
              ? t('free')
              : formatPrice(individual_price)
          }`}
          secondary={t('open_from_to', {
            startDate: formatDate(moment(startTime), 'MMM D'),
            endDate: formatDate(moment(endTime), 'MMM D'),
          })}
        />
        <IconButton
          onClick={handleExpand}
          aria-expanded={expanded}
          icon={icon}
          style={{ color: 'grey' }}
        />
      </ListItem>
      <CollapsePaymentOption
        teamPrice={team_price}
        individualPrice={individual_price}
        startTime={startTime}
        endTime={endTime}
        owner={owner}
        taxRates={taxRates}
        teamActivity={team_activity}
        expanded={expanded}
        setEdit={setEdit}
        setAlertDialog={setAlertDialog}
      />
      <Divider />
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.EDIT_EVENT_PAYMENT_OPTION}
        items={{
          open: edit,
          onClose: () => {
            setEdit(false);
          },
          option,
          editOptionEvent,
        }}
      />
      <AlertDialog
        open={alertDialog}
        onSubmit={onDelete}
        onCancel={() => setAlertDialog(false)}
        description={t('delete_payment_option_confirmation')}
        title={t('delete_payment_option')}
      />
    </div>
  );
}
