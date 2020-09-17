import { Router } from 'express';
import validation from './validation';
import { joiValidator } from 'iyasunday';
import * as controller from './controller';
import { checkCache } from '../../utils';

const route = Router();

route.post('/match/', joiValidator(validation.create), controller.create);
route.post(
  '/match/:_id/score',
  joiValidator(validation.addScore),
  checkCache,
  controller.addScore
);
route.get(
  '/match/:_id/score',
  joiValidator(validation.view),
  controller.viewScore
);
route.get('/matches/', controller.list);
route.get(
  '/match/:_id/',
  joiValidator(validation.view),
  checkCache,
  controller.view
);

export default route;
