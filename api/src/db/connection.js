import knex from 'knex';
import { Model } from 'objection';
import * as config from '../../../knexfile.js';
const environment = process.env.NODE_ENV || 'development';

const myknex = knex(config[environment])

Model.knex(myknex);
export default myknex




