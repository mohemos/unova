import Joi from '@hapi/joi';
import { LEAGUES } from '../../utils/constants';

export default {
  create: {
    body: {
      schema: Joi.object({
        league: Joi.string()
          .valid(...LEAGUES)
          .required(),
        awayTeamId: Joi.string().max(30).required(),
        homeTeamId: Joi.string().max(30).required(),
        awayTeamScore: Joi.array().items(Joi.number()).default([]),
        homeTeamScore: Joi.array().items(Joi.number()).default([]),
        startAt: Joi.date().required(),
        endAt: Joi.date().required(),
      }),
    },
  },
  addScore: {
    body: {
      schema: Joi.object({
        visitation: Joi.string().required(),
        round: Joi.number().integer().required(),
        score: Joi.number().integer().default(0),
        hit: Joi.number().integer().default(0),
        error: Joi.number().integer().default(0),
      }),
    },
    params: {
      schema: Joi.object({
        _id: Joi.string().required(),
      }),
    },
  },
  view: {
    params: {
      schema: Joi.object({
        _id: Joi.string().required(),
      }),
    },
  },
};
