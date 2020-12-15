import React, { useEffect } from 'react';
import { IconButton } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import { useTranslation } from 'react-i18next';
import styles from './PersonSelect.module.css';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import PersonItem from '../../../components/Custom/List/PersonItem';
import { useParams } from 'react-router-dom';

export default function PersonSelect(props) {
  const { t } = useTranslation();
  const { formik, stepHook } = props;
  const { id: eventId } = useParams();

  useEffect(() => {
    getPersons();
    stepHook.handleCompleted(1);
  }, []);

  const getPersons = async () => {
    const { data } = await api(
      formatRoute('/api/user/ownedPersonsRegistration', null, {
        eventId,
      }),
    );

    if (!data[0].registered) {
      formik.setFieldValue('persons', [data[0]]);
      data.shift();
    }
    formik.setFieldValue('allPersons', data);
  };

  const addPerson = person => {
    const persons = formik.values.persons;
    persons.push(person);
    formik.setFieldValue('persons', persons);
    formik.setFieldValue(
      'allPersons',
      formik.values.allPersons.filter(p => p.id !== person.id),
    );
    stepHook.handleCompleted(1);
  };

  const removePerson = person => {
    const allPersons = [...formik.values.allPersons, person];
    formik.setFieldValue('allPersons', allPersons);
    const persons = formik.values.persons.filter(
      p => p.id !== person.id,
    );
    formik.setFieldValue('persons', persons);
    if (persons.length < 1) {
      stepHook.handleNotCompleted(1);
    }
  };

  return (
    <div className={styles.main}>
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        style={{ marginBottom: '8px' }}
      >
        {t('choose_person_you_can_choose_more_than_one_person')}
      </Typography>
      <Typography
        variant="body2"
        component="p"
        style={{ marginBottom: '8px' }}
      >
        {t('selected_persons')}
      </Typography>
      {formik.values.persons.length < 1 ? (
        <Typography component="p" style={{ marginBottom: '8px' }}>
          {t('no_person_selected')}
        </Typography>
      ) : (
        <></>
      )}
      {formik.values.persons.map(p => (
        <PersonItem
          key={p.id}
          completeName={p.complete_name}
          onClick={() => {
            removePerson(p);
          }}
          secondaryActions={[
            <IconButton
              icon="Remove"
              toolTip={t('remove')}
              style={{ color: 'secondary' }}
            />,
          ]}
        />
      ))}
      {formik.values.allPersons.length ? (
        <>
          <Typography
            variant="body2"
            component="p"
            style={{ marginBottom: '8px' }}
          >
            {t('my_persons')}
          </Typography>
          {formik.values.allPersons.map(p => (
            <PersonItem
              key={p.id}
              completeName={p.complete_name}
              onClick={() => {
                addPerson(p);
              }}
              disabled={p.registered}
              secondary={
                p.registered ? t('registered_singular') : null
              }
              secondaryActions={[
                <IconButton
                  icon="Add"
                  toolTip={t('add')}
                  style={{ color: 'primary' }}
                />,
              ]}
            />
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
