import knex from 'knex'
import * as config from '../../../knexfile.js';
const environment = process.env.NODE_ENV || 'development';

const myknex = knex(config[environment])

export default myknex




