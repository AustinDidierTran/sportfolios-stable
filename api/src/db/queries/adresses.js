import { addresses } from '../models/addresses.js';

export const insertAddress = async body => {
  const { streetAddress, city, state, zip, country } = body;

  const address = await addresses
    .query()
    .insertGraph({
      street_address: streetAddress,
      city,
      state,
      zip,
      country,
    })
    .returning('id', 'street_address', 'city', 'state', 'zip', 'country');

  return {
    id: address.id,
    streetAddress: address.street_address,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
  };
};
