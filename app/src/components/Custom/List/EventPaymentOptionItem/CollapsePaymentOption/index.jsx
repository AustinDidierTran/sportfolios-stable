import React from 'react';
import { ListItem, ListItemText } from '../../../../MUI';
import { Collapse, Button } from '../../..';
import { Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  formatDate,
  formatPrice,
} from '../../../../../utils/stringFormats';
import moment from 'moment';
import styles from './CollapsePaymentOption.module.css';

export default function CollapsePaymentOption(props) {
  const { t } = useTranslation();
  const {
    teamPrice,
    individualPrice,
    startTime,
    endTime,
    owner,
    taxRates,
    teamActivity,
    expanded,
    setEdit,
    setAlertDialog,
  } = props;

  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <div style={{ backgroundColor: '#F5F5F5' }}>
        <ListItem>
          <ListItemText
            primary={
              teamActivity
                ? t('team_activity')
                : t('individual_activity')
            }
            secondary={t('open_from_to', {
              startDate: formatDate(moment(startTime), 'LLLL'),
              endDate: formatDate(moment(endTime), 'LLLL'),
            })}
          />
        </ListItem>
        <ListItem>
          {owner.basicInfos ? (
            <ListItemText
              primary={owner.basicInfos.name}
              secondary={t('payment_option_owner')}
            />
          ) : (
            <ListItemText
              primary={t('no_owner_free_payment_option')}
              secondary={t('payment_option_owner')}
            />
          )}
        </ListItem>
        <Divider />
        <>
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('subtotal')}:`} />
            <ListItemText
              primary={`${formatPrice(individualPrice)}`}
              secondary={t('price_individual')}
            ></ListItemText>
            <ListItemText
              primary={`${formatPrice(teamPrice)}`}
              secondary={t('price_team')}
            ></ListItemText>
          </ListItem>
          {taxRates.map((t, index) => (
            <ListItem className={styles.money} key={index}>
              <ListItemText
                primary={`${t.display_name} (${t.percentage}%)`}
                secondary={t.description}
              />
              <ListItemText
                primary={`${formatPrice(
                  (individualPrice * t.percentage) / 100,
                )}`}
              ></ListItemText>
              <ListItemText
                primary={`${formatPrice(
                  (teamPrice * t.percentage) / 100,
                )}`}
              ></ListItemText>
            </ListItem>
          ))}
          <Divider />
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('total')}:`} />
            <ListItemText
              primary={`${formatPrice(
                taxRates.reduce((prev, curr) => {
                  return (
                    prev + (individualPrice * curr.percentage) / 100
                  );
                }, 0) + individualPrice,
              )}`}
            ></ListItemText>
            <ListItemText
              primary={`${formatPrice(
                taxRates.reduce((prev, curr) => {
                  return prev + (teamPrice * curr.percentage) / 100;
                }, 0) + teamPrice,
              )}`}
            ></ListItemText>
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
  );
}
