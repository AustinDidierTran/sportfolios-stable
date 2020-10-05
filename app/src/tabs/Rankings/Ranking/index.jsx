import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '../../../components/MUI';
import { List } from '../../../components/Custom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import styles from './Ranking.module.css';
import { GLOBAL_ENUM } from '../../../../../common/enums';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
}));

export default function Ranking(props) {
  const { ranking, title, withStats } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const onExpand = () => {
    const exp = !expanded;
    setExpanded(exp);
  };

  return (
    <div className={styles.div}>
      <Accordion expanded={expanded} onChange={onExpand}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={classes.primary} />}
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {withStats ? (
            <List
              items={ranking.map((r, index) => ({
                ...r,
                type: GLOBAL_ENUM.RANKING_WITH_STATS,
                index: index + 1,
              }))}
            />
          ) : (
            <List
              items={ranking.map((r, index) => ({
                ...r,
                type: GLOBAL_ENUM.RANKING,
                index: index + 1,
              }))}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
