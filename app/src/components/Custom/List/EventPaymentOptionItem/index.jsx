import React, { useState, useContext } from 'react';
import { ListItem, ListItemText } from '../../../MUI';
import {
  FormDialog,
  IconButton,
  AlertDialog,
  Collapse,
  Button,
} from '../../../Custom';
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
import styles from './EventPaymentOptionItem.module.css';

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
  } = option;

  const { dispatch } = useContext(Store);
  const [alertDialog, setAlertDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [icon, setIcon] = useState('KeyboardArrowDown');

  const onDelete = async () => {
    await api(formatRoute('/api/entity/option', null, { id }), {
      method: 'DELETE',
    });
    update();
    setAlertDialog(false);
  };

  const handleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (newExpanded === true) {
      setIcon('KeyboardArrowUp');
    } else {
      setIcon('KeyboardArrowDown');
    }
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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div style={{ backgroundColor: '#F5F5F5' }}>
          <ListItem>
            <ListItemText
              secondary={t('open_from_to', {
                startDate: formatDate(moment(startTime), 'LLLL'),
                endDate: formatDate(moment(endTime), 'LLLL'),
              })}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={owner.basicInfos.name}
              secondary={t('payment_option_owner')}
            />
          </ListItem>
          <Divider />
          <>
            <ListItem className={styles.money}>
              <ListItemText primary={`${t('subtotal')}:`} />
              {individual_price ? (
                <ListItemText
                  primary={`${formatPrice(individual_price)}`}
                  secondary={t('price_individual')}
                ></ListItemText>
              ) : (
                <></>
              )}
              {team_price ? (
                <ListItemText
                  primary={`${formatPrice(team_price)}`}
                  secondary={t('price_team')}
                ></ListItemText>
              ) : (
                <></>
              )}
            </ListItem>
            {taxRates.map(t => (
              <ListItem className={styles.money}>
                <ListItemText
                  primary={`${t.display_name} (${t.percentage}%)`}
                  secondary={t.description}
                />
                {individual_price ? (
                  <ListItemText
                    primary={`${formatPrice(
                      (individual_price * t.percentage) / 100,
                    )}`}
                  ></ListItemText>
                ) : (
                  <></>
                )}
                {team_price ? (
                  <ListItemText
                    primary={`${formatPrice(
                      (team_price * t.percentage) / 100,
                    )}`}
                  ></ListItemText>
                ) : (
                  <></>
                )}
              </ListItem>
            ))}
            <Divider />
            <ListItem className={styles.money}>
              <ListItemText primary={`${t('total')}:`} />
              {individual_price ? (
                <ListItemText
                  primary={`${formatPrice(
                    taxRates.reduce((prev, curr) => {
                      return (
                        prev +
                        (individual_price * curr.percentage) / 100
                      );
                    }, 0) + individual_price,
                  )}`}
                ></ListItemText>
              ) : (
                <></>
              )}
              {team_price ? (
                <ListItemText
                  primary={`${formatPrice(
                    taxRates.reduce((prev, curr) => {
                      return (
                        prev + (team_price * curr.percentage) / 100
                      );
                    }, 0) + team_price,
                  )}`}
                ></ListItemText>
              ) : (
                <></>
              )}
            </ListItem>
            <Divider />
          </>
          <Button
            endIcon="Edit"
            onClick={() => {
              setEdit(true);
            }}
            style={{ margin: '8px' }}
          >
            {t('edit')}
          </Button>
          <Button
            endIcon="Delete"
            onClick={() => setAlertDialog(true)}
            color="secondary"
            style={{ margin: '8px' }}
          >
            {t('delete')}
          </Button>
        </div>
      </Collapse>
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
