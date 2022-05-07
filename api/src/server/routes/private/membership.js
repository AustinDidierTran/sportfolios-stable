import Router from 'koa-router';
import * as service from '../../service/membership.ts';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';

const router = new Router();
const BASE_URL = '/api/membership';


router.get(`${BASE_URL}/members`, async ctx => {
    const entity = await service.getMembers(
      ctx.query.personId,
      ctx.query.organizationId,
    );
  
    if (!entity) {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }
    ctx.body = { data: entity };
  });

export default router;
