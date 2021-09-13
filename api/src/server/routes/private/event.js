import Router from 'koa-router';
import * as service from '../../service/event.js';
import { STATUS_ENUM } from '../../../../../common/enums/index.js';
import { ERROR_ENUM, errors } from '../../../../../common/errors/index.js';

const router = new Router();
const BASE_URL = '/api/event';


export default router;