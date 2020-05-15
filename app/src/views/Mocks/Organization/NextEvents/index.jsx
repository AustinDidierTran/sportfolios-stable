import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './NextEvents.module.css';
import { Avatar } from '../../../../components/Custom';
import {
  Typography,
  Card,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Container,
} from '../../../../components/MUI';
import CardHeader from '@material-ui/core/CardHeader';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';

export default function NextEvents(props) {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={styles.card}>
      <CardHeader title={t('upcoming_events')} />
      <List>
        <ListItem>
          <Container className={styles.event}>
            <ListItemIcon>
              <Avatar
                initials={'5 May'}
                size="md"
                className={styles.avatar}
              />
            </ListItemIcon>
            <Container className={styles.infos}>
              <Typography className={styles.name} variant="h6">
                CQU5-Primavera
              </Typography>
              <hr />
              <Typography className={styles.place} variant="h7">
                Montréal
              </Typography>
            </Container>
            <IconButton
              className={clsx(styles.expand, {
                [styles.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>Plus d'informations</Typography>
              </CardContent>
            </Collapse>
          </Container>
        </ListItem>
      </List>
    </Card>
  );
}
