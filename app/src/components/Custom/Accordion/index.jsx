import React, { useState } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, List } from '../';
import { Typography } from '../../MUI';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
}));

export default function CustomAccordion(props) {
  const { title, items, ...otherProps } = props;
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);

  const onExpand = () => {
    const exp = !expanded;
    setExpanded(exp);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={onExpand}
      {...otherProps}
    >
      <AccordionSummary
        expandIcon={
          <Icon icon="ExpandMore" className={classes.primary} />
        }
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List items={items} />
      </AccordionDetails>
    </Accordion>
  );
}
