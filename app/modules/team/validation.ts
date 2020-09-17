import Joi from '@hapi/joi';
import { LEAGUES } from '../../utils/constants';

export default {
  create: {
    body: {
      schema: Joi.object({
        name: Joi.string().max(100).trim().required(),
        abbreviation: Joi.string().trim().max(20).required(),
        logoUrl: Joi.string().uri().required(),
        players: Joi.array().default([]),
        color: Joi.string().required(),
      }),
    },
  },
  update: {
    body: {
      schema: Joi.object({
        name: Joi.string().max(100).required(),
        abbreviation: Joi.string().max(20).required(),
        logoUrl: Joi.string().uri().required(),
      }),
    },
    params: {
      schema: Joi.object({
        _id: Joi.string().required(),
      }),
    },
  },
  list: {
    query: {
      schema: Joi.object({
        limit: Joi.number().integer().default(20),
        pageId: Joi.number().integer().default(1),
      }),
    },
  },
  remove: {
    params: {
      schema: Joi.object({
        _id: Joi.string().required(),
      }),
    },
  },
};
