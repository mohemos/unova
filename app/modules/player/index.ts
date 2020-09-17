import { Router } from 'express';
import validation from './validation';
import { joiValidator } from 'iyasunday';
import * as controller from './controller';

const route = Router();
route.post(
  '/team/:teamId/player',
  joiValidator(validation.create),
  controller.create
);
route.get('/team/:teamId/players', controller.list);
route.delete(
  '/team/:teamId/player/:_id',
  joiValidator(validation.remove),
  controller.remove
);
export default route;
