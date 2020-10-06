import React, { useEffect, useState } from 'react';

import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import Divider from '@material-ui/core/Divider';
import { ListItem, ListItemText } from '../../MUI';
import styles from './DnDSimpleList.module.css';

const grid = 8;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? '#F0F0F0' : 'white',
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'whitesmoke' : 'white',
  padding: grid,
  width: '100%',
});

export default function CustomSimpleListDnD(props) {
  const { items: itemsProps, withIndex, ...otherProps } = props;

  const [items, setItems] = useState(itemsProps);

  useEffect(() => {
    setItems(itemsProps);
  }, [itemsProps]);

  const onDragEnd = result => {
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

  return (
    <DragDropContext onDragEnd={onDragEnd} {...otherProps}>
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
                    {withIndex ? (
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
                    ) : (
                      <ListItem>
                        <div style={{ width: '100%' }}>
                          <ListItemText primary={item.content} />
                        </div>
                      </ListItem>
                    )}
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
  );
}
