import React from 'react';

import Organizations from './Organizations';
import Teams from './Teams';
import Funding from './Founding';

export default function General(props) {
  const { isSelf } = props;

  const funding = {
    name: 'Hydra 2020',
    description: 'Aidez-moi à financer ma saison 2020!',
    goal: 100,
    reach: 30,
  };
  const teams = [
    {
      name: "Sherbrooke Gentlemen's Club",
      highlight: '1er au Frisbeefest',
      photoUrl:
        'https://scontent.fymq3-1.fna.fbcdn.net/v/t31.0-8/16601694_1816442828595987_7062384760727602723_o.png?_nc_cat=108&_nc_sid=85a577&_nc_oc=AQmXIHZDgx6xtBhk7KqP4dMXYyd5RUvMOSfVar2w7PpSq-U01pTfEkPWsvfV-KgaRAA&_nc_ht=scontent.fymq3-1.fna&oh=bdb86d087861f779bd545cbb3cefba1f&oe=5EED9A24',
    },
    {
      name: 'Barons',
      highlight: '9è aux CCUES',
      photoUrl:
        'https://www.seminaire-sherbrooke.qc.ca/secondaire/images/logo-barons-gros.png',
    },
  ];

  const organizations = [
    {
      initials: 'FQU',
      name: "Fédération québécoise d'ultimate",
      role: 'administrateur',
      photoUrl:
        'https://scontent.fymq2-1.fna.fbcdn.net/v/t1.0-9/66500989_10156181959966712_1462670276796874752_n.png?_nc_cat=102&_nc_sid=85a577&_nc_oc=AQmzziZEsG-RlLkW4MgiZgP6B7jjjjMbP24lyLJrYd32c6jevFEdoQLXMwDV-euRsMQ&_nc_ht=scontent.fymq2-1.fna&oh=e26d067f63be9d9c2fe46bf5a6f1a469&oe=5EEB812B',
    },
    {
      initials: 'AUS',
      name: "Association d'ultimate de Sherbrooke",
      role: 'administrateur',
      photoUrl:
        'https://scontent.fymq3-1.fna.fbcdn.net/v/t1.0-9/27067856_10154940107067136_3164725535508385407_n.png?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=Agx0ntU-1Q0AX-uR3H1&_nc_ht=scontent.fymq3-1.fna&oh=5aa190eb2c1ced25bb67f6de08d0b6d1&oe=5EF2EB29',
    },
  ];

  return (
    <>
      <Funding isSelf={isSelf} {...funding} />
      <Teams isSelf={isSelf} teams={teams} />
      <Organizations isSelf={isSelf} organizations={organizations} />
    </>
  );
}
