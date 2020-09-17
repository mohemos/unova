import { Router } from 'express';
import validation from './validation';
import { joiValidator } from 'iyasunday';
import * as controller from './controller';

const route = Router();
route.post('/team', joiValidator(validation.create), controller.create);
route.patch('/team/:_id', joiValidator(validation.update), controller.update);
route.get('/teams', joiValidator(validation.list), controller.list);
route.delete('/team/:_id', joiValidator(validation.remove), controller.remove);
export default route;
