import React, { useEffect, useState } from 'react';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
  ListItemSecondaryAction,
  ListItemText,
  Card,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SendIcon from '@material-ui/icons/Send';
import styles from './MyPersons.module.css';
import { formatRoute } from '../../../actions/goTo';
import api from '../../../actions/api';
import { LoadingSpinner, Avatar } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';

export default function MyPersons() {
  const { t } = useTranslation();
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState([true]);

  const fetchOwnedPersons = async () => {
    const { data } = await api(
      formatRoute('/api/user/ownedPersons', null, {
        type: GLOBAL_ENUM.PERSON,
      }),
    );
    //Permet de mettre la primary person comme 1er élément de la liste
    for (var i = 0; i < data.length; i++) {
      if (data[i].isPrimaryPerson) {
        data.unshift(data.splice(i, 1)[0]);
        break;
      }
    }

    setPersons(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOwnedPersons();
  }, []);

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  return (
    <Card className={styles.card}>
      <Grid item xs={12}>
        <Typography variant="h6" className={styles.title}>
          {t('my_persons')}
        </Typography>
        <div className={styles.demo}>
          <List>
            {persons.map(person => {
              const subtitle = person.isPrimaryPerson
                ? t('primary_person')
                : t('secondary_person'); //TODO use translate
              const Icon = person.isPrimaryPerson
                ? EditIcon
                : SendIcon;
              return (
                <ListItem>
                  <ListItemAvatar>
                    {person.surname ? (
                      <Avatar
                        photoUrl={person.photoUrl}
                        initials={
                          person.name.charAt(0) +
                          person.surname.charAt(0)
                        }
                      />
                    ) : (
                      <Avatar
                        photoUrl={person.photoUrl}
                        initials={person.name.charAt(0)}
                      />
                    )}
                    <Avatar
                      photoUrl={person.photoUrl}
                      initials={
                        person.name.charAt(0) +
                        person.surname.charAt(0)
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={person.name + ' ' + person.surname}
                    secondary={subtitle}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <Icon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
      </Grid>
    </Card>
  );
}
