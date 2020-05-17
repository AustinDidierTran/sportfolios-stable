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
      <Typography className={styles.title} variant="h3">
        {t('upcoming_events')}
      </Typography>
      <List>
        <ListItem>
          <Container className={styles.event}>
            <ListItemIcon>
              <Avatar
                initials={'P'}
                size="md"
                className={styles.avatar}
              />
            </ListItemIcon>
            <Container className={styles.infos}>
              <Container className={styles.tournoi}>
                <Typography className={styles.name} variant="h3">
                  Primavera
                </Typography>
                <Typography className={styles.circuit} variant="h5">
                  CQU5
                </Typography>
              </Container>
              <hr />
              <Container className={styles.placetime}>
                <Typography className={styles.date} variant="h5">
                  5 Mai
                </Typography>
              </Container>
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
            <Collapse
              in={expanded}
              timeout="auto"
              unmountOnExit
              className={styles.description}
            >
              <CardContent>
                <Typography className={styles.place} variant="h6">
                  3791, Chemin Queen Mary, Montréal, QC H3V 1A8
                </Typography>
                <br />
                <Typography paragraph variant="h6">
                  Plus d'informations
                </Typography>
              </CardContent>
            </Collapse>
          </Container>
        </ListItem>
      </List>
    </Card>
  );
}
