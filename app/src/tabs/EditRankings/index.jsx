import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { ListItem, ListItemText } from '../../components/MUI';
import Divider from '@material-ui/core/Divider';
import styles from './EditRankings.module.css';
import { Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgrey' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightgrey' : 'white',
  padding: grid,
  width: '100%',
});

export default function EditRankings() {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id: eventId } = useParams();

  const [items, setItems] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const onExpand = () => {
    const exp = !expanded;
    setExpanded(exp);
  };

  useEffect(() => {
    getRankings();
  }, []);

  const getRankings = async () => {
    const { data } = await api(
      formatRoute('/api/entity/rankings', null, {
        eventId,
      }),
    );
    const ranking = data
      .map(d => ({
        position: d.initial_position,
        content: d.name,
        id: d.team_id,
      }))
      .sort((a, b) => a.position - b.position)
      .map((m, index) => {
        if (!m.position) {
          m.position = index + 1;
        }
        return m;
      });
    setItems(ranking);
  };

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index,
    );

    setItems(newItems);
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <div className={styles.div}>
      <Accordion expanded={expanded} onChange={onExpand}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={classes.primary} />}
        >
          <Typography>{t('pre_ranking')}</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.accordion}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          <ListItem>
                            <div
                              className={styles.main}
                              style={{ width: '100%' }}
                            >
                              <ListItemText
                                className={styles.position}
                                secondary={index + 1}
                              />
                              <ListItemText
                                className={styles.name}
                                primary={item.content}
                              />
                            </div>
                          </ListItem>
                          <Divider />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
