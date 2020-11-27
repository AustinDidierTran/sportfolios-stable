import React, { useState, useMemo } from 'react';
import { ListItem, ListItemText } from '../../../MUI';
import { Button, Collapse, IconButton } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { Divider } from '@material-ui/core';
import { formatPrice } from '../../../../utils/stringFormats';
import styles from './MembershipOrganizationItem.module.css';

export default function MembershipOrganizationItem(props) {
  const { t } = useTranslation();

  const {
    membership,
    price,
    membershipType,
    expirationDate,
    onDelete,
    id,
    taxRates,
  } = props;
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const icon = useMemo(
    () => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'),
    [expanded],
  );

  return (
    <>
      <ListItem onClick={handleExpand}>
        <ListItemText
          primary={`${membership} | ${formatPrice(price)}`}
          secondary={membershipType}
        ></ListItemText>
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
              primary={membershipType}
              secondary={`${t('expire_on')} ${expirationDate}`}
            ></ListItemText>
          </ListItem>
          <ListItem className={styles.money}>
            <ListItemText
              primary={`${t('subtotal')}:`}
            ></ListItemText>
            <ListItemText
              primary={`${formatPrice(price)}`}
            ></ListItemText>
          </ListItem>
          {taxRates.map(t => (
            <ListItem className={styles.money}>
              <ListItemText
                primary={`${t.display_name} (${t.percentage}%)`}
                secondary={t.description}
              ></ListItemText>
              <ListItemText
                primary={`${formatPrice(
                  (price * t.percentage) / 100,
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
                  return prev + (price * curr.percentage) / 100;
                }, 0) + price,
              )}`}
            />
          </ListItem>
          <Divider />
          <Button
            onClick={() => {
              onDelete(id);
            }}
            endIcon="Delete"
            color="secondary"
            style={{ margin: '8px' }}
          >
            {t('delete')}
          </Button>
        </div>
      </Collapse>
      <Divider />
    </>
  );
}
