import React, { useEffect } from 'react';
import { MultiSelect } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import { useTranslation } from 'react-i18next';
import styles from './PersonSelect.module.css';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../../common/enums';

export default function PersonSelect(props) {
  const { t } = useTranslation();
  const { formik, stepHook } = props;

  useEffect(() => {
    getPersons();
    stepHook.handleCompleted(1);
  }, []);

  const getPersons = async () => {
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
    const res = data.map(d => ({
      display: d.complete_name,
      value: d.id,
    }));
    formik.setFieldValue('allPersons', res);
    formik.setFieldValue('persons', [res[0]]);
  };

  const handleChange = value => {
    if (value.length < 1) {
      stepHook.handleNotCompleted(1);
    } else {
      stepHook.handleCompleted(1);
    }
    formik.setFieldValue('persons', value);
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
      <MultiSelect
        label={t('persons')}
        options={formik.values.allPersons}
        values={formik.values.persons}
        onChange={handleChange}
      />
    </div>
  );
}
