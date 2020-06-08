import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './OrganizationList.module.css';
import { Avatar, Paper, List, Button } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { ROUTES } from '../../actions/goTo';

import history from '../../stores/history';

export default function OrganizationList(props) {
  const { t } = useTranslation();

  const data = [
    {
      name: "Fédération québécoise d'ultimate",
      photoUrl:
        'https://scontent.fymq2-1.fna.fbcdn.net/v/t1.0-9/66500989_10156181959966712_1462670276796874752_n.png?_nc_cat=102&_nc_sid=85a577&_nc_oc=AQmzziZEsG-RlLkW4MgiZgP6B7jjjjMbP24lyLJrYd32c6jevFEdoQLXMwDV-euRsMQ&_nc_ht=scontent.fymq2-1.fna&oh=e26d067f63be9d9c2fe46bf5a6f1a469&oe=5EEB812B',
    },
    {
      name: "Association d'ultimate de Sherbrooke",
      photoUrl:
        'https://scontent.fymq3-1.fna.fbcdn.net/v/t1.0-9/27067856_10154940107067136_3164725535508385407_n.png?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=Agx0ntU-1Q0AX-uR3H1&_nc_ht=scontent.fymq3-1.fna&oh=5aa190eb2c1ced25bb67f6de08d0b6d1&oe=5EF2EB29',
    },
  ];

  const handleClick = () => {
    history.push(ROUTES.createOrganization);
  };

  return (
    <Paper className={styles.card}>
      <Typography variant="h3" className={styles.title}>
        {t('organizations')}
      </Typography>
      <Button onClick={handleClick} className={styles.button}>
        {t('create_organization')}
      </Button>
      <List
        items={data.map(d => ({
          value: d.name,
          onClick: () => history.push('/organization'),
          iconComponent: <Avatar photoUrl={d.photoUrl} />,
        }))}
      />
    </Paper>
  );
}
