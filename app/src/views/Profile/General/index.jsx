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
      name: 'Hydro',
      highlight: '9è au US Open',
    },
    {
      name: 'Barons',
      highlight: '9è aux CCUES',
    },
  ];

  const organizations = [
    {
      initials: 'FQU',
      name: "Fédération québécoise d'ultimate",
      role: 'administrateur',
    },
    {
      initials: 'AUS',
      name: "Association d'ultimate de Sherbrooke",
      role: 'administrateur',
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
