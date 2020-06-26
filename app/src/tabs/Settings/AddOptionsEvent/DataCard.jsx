import React from 'react';

import { Button, Paper } from '../../../components/Custom';
import {
  List,
  ListItem,
  ListItemText,
} from '../../../components/MUI';
import { useTranslation } from 'react-i18next';

// Buttons
import moment from 'moment';

export default function DataCard(props) {
  const { data, headers, onDelete } = props;
  const { t } = useTranslation();

  return (
    <Paper>
      <List>
        {headers.map(h => (
          <ListItem>
            {h.display ? (
              <>
                {h.display === t('price') ? (
                  <ListItemText
                    style={{ margin: '0px' }}
                    primary={`${data[h.value]}$`}
                    secondary={h.display}
                  ></ListItemText>
                ) : (
                  <ListItemText
                    style={{ margin: '0px' }}
                    primary={data[h.value]}
                    secondary={h.display}
                  ></ListItemText>
                )}
              </>
            ) : (
              <ListItemText
                style={{ margin: '0px' }}
                primary={moment(data[h.value]).format('LL')}
                secondary={h.helperText}
              ></ListItemText>
            )}
          </ListItem>
        ))}
      </List>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        endIcon="Delete"
        style={{ margin: '8px' }}
        onClick={() => {
          onDelete(data[4]);
        }}
      >
        {t('delete')}
      </Button>
    </Paper>
  );
}
