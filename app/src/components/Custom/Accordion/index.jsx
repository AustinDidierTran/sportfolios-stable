import React, { useState } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { Icon } from '../';
import { ListItemText } from '../../MUI';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
}));

export default function CustomAccordion(props) {
  const { title, content, ...otherProps } = props;
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
        <ListItemText primary={title} />
      </AccordionSummary>
      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  );
}
