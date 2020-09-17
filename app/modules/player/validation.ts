import Joi from '@hapi/joi';
import { LEAGUES } from '../../utils/constants';

export default {
  create: {
    body: {
      schema: Joi.object({
        firstName: Joi.string().max(100).trim().required(),
        lastName: Joi.string().max(100).trim().required(),
        imageUrl: Joi.string().uri().required(),
      }),
    },
    params: {
      schema: Joi.object({
        teamId: Joi.string().required(),
      }),
    },
  },
  update: {
    body: {
      schema: Joi.object({
        firstName: Joi.string().max(100).required(),
        lastName: Joi.string().max(100).required(),
        imageUrl: Joi.string().uri().required(),
      }),
    },
    params: {
      schema: Joi.object({
        _id: Joi.string().required(),
        teamId: Joi.string().required(),
      }),
    },
  },
  remove: {
    params: {
      schema: Joi.object({
        _id: Joi.string().required(),
        teamId: Joi.string().required(),
      }),
    },
  },
};
