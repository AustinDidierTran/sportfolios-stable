import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './NextEvents.module.css';
import Register from './Register';
import { Avatar } from '../../../../components/Custom';
import {
  Typography,
  Card,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Container,
  Divider,
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
              <Container className={styles.dateregister}>
                <Typography className={styles.date} variant="h5">
                  5 Mai
                </Typography>
                <Register className={styles.register} />
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
              <Divider className={styles.divider} />
              <CardContent>
                <Typography className={styles.place} variant="h6">
                  3791, Chemin Queen Mary, Montréal, QC H3V 1A8
                </Typography>
                <br />
                <Typography paragraph variant="h6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </Typography>
              </CardContent>
            </Collapse>
          </Container>
        </ListItem>
      </List>
    </Card>
  );
}
