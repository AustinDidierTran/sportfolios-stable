import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Funding.module.css';
import {
  Card,
  Typography,
  Container,
  IconButton,
} from '../../../../../components/MUI';
import { Button } from '../../../../../components/Custom';

import LinearProgress from '@material-ui/core/LinearProgress';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

export default function Funding(props) {
  const { t } = useTranslation();

  const [completed, setCompleted] = useState(30);

  const [goal, setGoal] = useState(100);

  const [donate, setDonate] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onDonate = async () => {
    setDonate(true);
  };

  const percentage = () => {
    return (completed / goal) * 100;
  };

  const BorderLinearProgress = withStyles({
    root: {
      height: 24,
      borderRadius: 32,
    },
    bar: {
      borderRadius: 24,
    },
  })(LinearProgress);

  return (
    <Card className={styles.card}>
      <Typography variant="h3" className={styles.title}>
        Campagne de financement Hydra 2020
      </Typography>
      <Typography
        variant="h6"
        color="textSecondary"
        className={styles.subtitle}
      >
        Bonjour! Vous voulez m'aider à financer ma saison de frisbee
        cet été. Vous êtes à la bonne place!
      </Typography>
      <Container className={styles.container}>
        <div className={styles.bar}>
          <BorderLinearProgress
            variant="determinate"
            value={completed}
            color="primary"
          />
        </div>
        <Typography
          className={styles.funded}
          disabled
          color="primary"
          variant="h5"
        >
          {completed}$
        </Typography>
        <Typography
          className={styles.goal}
          variant="h6"
          disabled
          color="primary"
        >
          Objectif: {goal}$
        </Typography>
        <Typography
          className={styles.progression}
          disabled
          color="primary"
          variant="h6"
        >
          {percentage()}%
        </Typography>
        <Button
          className={styles.donate}
          endIcon="AttachMoney"
          onClick={onDonate}
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
      </Container>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Cet été mon équipe et moi voulons participer à plusieurs
            tournois, nous planifions voyager à Boston, New-York pour
            compétitionner avec les meilleurs équipes junior en
            Amérique du Nord. Merci de m'aider dans mes démarches!
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
