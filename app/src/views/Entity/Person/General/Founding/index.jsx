import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Funding.module.css';
import { Typography, Container } from '../../../../../components/MUI';
import { Button, Paper } from '../../../../../components/Custom';

import LinearProgress from '@material-ui/core/LinearProgress';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';

export default function Funding(props) {
  const { isSelf, description, name, goal, reach } = props;
  const { t } = useTranslation();

  const onEdit = () => {
    alert('Edit');
  };

  const onFunding = () => {
    alert('Merci pour votre financement!');
  };

  const onButtonClick = () => {
    isSelf ? onEdit() : onFunding();
  };

  const percentage = () => {
    return (reach / goal) * 100;
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

  const buttonLabel = isSelf ? t('edit') : t('donate');

  const endIcon = isSelf ? 'Edit' : 'AttachMoney';

  return (
    <Paper className={styles.card} title={t('funding')}>
      <CardHeader title={name} subheader={description} />
      <Container className={styles.container}>
        <div className={styles.bar}>
          <BorderLinearProgress
            variant="determinate"
            value={reach}
            color="primary"
          />
        </div>
        <Typography
          className={styles.funded}
          disabled
          variant="h3"
          color="primary"
        >
          {reach}$
        </Typography>
        <Typography
          className={styles.goal}
          disabled
          variant="h5"
          color="primary"
        >
          {t('funding_goal', { goal })}
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
          <Button
            endIcon={endIcon}
            onClick={onButtonClick}
            color="primary"
          >
            {buttonLabel}
          </Button>
        </div>
      </Container>
    </Paper>
  );
}
