import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Funding.module.css';
import {
  Card,
  Typography,
  Button,
} from '../../../../../components/MUI';
import LinearProgress from '@material-ui/core/LinearProgress';

import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';

export default function Funding(props) {
  const { t } = useTranslation();

  const [completed, setCompleted] = useState(30);

  const [goal, setGoal] = useState(100);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const donate = () => {
    console.log('Donate!');
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        title="Campagne de financement Hydra 2020"
        subheader="Objectif: 100$"
      />
      <CardContent>
        <LinearProgress
          className={styles.bar}
          variant="determinate"
          value={completed}
          color="primary"
        />
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
        >
          Bonjour, voici ma campagne de financement...
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          onClick={donate}
          className={styles.donate}
          color="primary"
        >
          {t('donate')}
        </Button>
        <IconButton
          className={clsx(styles.expand, {
            [styles.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Cet été mon équipe et moi voulons participer à plusieurs
            tournois, nous planifions voyager à Boston, New-York pour
            compétitionner avec les meilleurs équipes junior en
            Amérique du Nord...
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
