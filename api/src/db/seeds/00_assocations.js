export function seed(knex) {
  // Deletes ALL existing entries
  return knex('organizations')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('organizations').insert([
        {
          name: "Association d'ultimate de Sherbrooke",
          sport: 'Ultimate frisbee',
          memberLimit: 5000,
          isDeleted: false,
        },
        {
          name: "Association d'ultimate frisbee de Plessisville",
          sport: 'Ultimate frisbee',
          memberLimit: 50,
          isDeleted: true,
        },
        {
          name: "Association d'ultimate de Montreal",
          sport: 'Ultimate frisbee',
          memberLimit: 5000000,
          isDeleted: true,
        },
      ]);
    });
}
