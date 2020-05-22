import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Funding.module.css';
import {
  Card,
  Typography,
  IconButton,
  Container,
} from '../../../components/MUI';
import { Button } from '../../../components/Custom';

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

  const [editMode, setEditMode] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onEdit = async () => {
    setEditMode(true);
  };

  const percentage = () => {
    return (completed / goal) * 100;
  };

  const BorderLinearProgress = withStyles({
    root: {
      height: 12,
      borderRadius: 32,
    },
    bar: {
      borderRadius: 24,
    },
  })(LinearProgress);

  return (
    <Card className={styles.card}>
      <CardHeader
        title="Nom de la campagne"
        subheader="Courte description"
      />
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
          variant="h3"
          color="primary"
        >
          {completed}$
        </Typography>
        <Typography
          className={styles.goal}
          disabled
          variant="h5"
          color="primary"
        >
          Goal: {goal}$
        </Typography>
        <Typography
          className={styles.progression}
          disabled
          variant="h4"
          color="primary"
        >
          {percentage()}%
        </Typography>
        <div className={styles.edit}>
          <Button endIcon="Edit" onClick={onEdit} color="primary">
            {t('edit')}
          </Button>
        </div>

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
      </Container>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description complète</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
