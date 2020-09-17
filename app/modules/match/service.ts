import client from '../../utils/db';
import { COLLECTIONS, CACHE_DURATION } from '../../utils/constants';
import { ObjectId } from 'mongodb';
import * as cache from '../../utils/cache';
import {NotFoundError} from 'iyasunday';

export async function create(body) {
  try {
    body.homeTeamId = new ObjectId(body.homeTeamId);
    body.awayTeamId = new ObjectId(body.awayTeamId);
    const match = await client
      .db()
      .collection(COLLECTIONS.MATCH)
      .insertOne(body);

    return {
      success: true,
      data: await getMatch(match.ops[0]._id),
    };
  } catch (err) {
    throw err;
  }
}

export async function addScore({ _id }: any, body) {
  try {
    const { visitation, round, score, hit, error } = body;
    const roundKey = `${visitation}.round`;

    const queryCondition = { _id: new ObjectId(_id), [roundKey]: round };

    const checkRound = await client
      .db()
      .collection(COLLECTIONS.MATCH)
      .findOne(queryCondition);

    if (!checkRound) {
      const field = {};
      if (score) field['score'] = score;
      if (hit) field['hit'] = hit;
      if (error) field['error'] = error;

      await client
        .db()
        .collection(COLLECTIONS.MATCH)
        .updateOne(
          { _id: new ObjectId(_id) },
          { $push: { [visitation]: { ...field, round } } }
        );
    } else {
      const $inc = {};
      if (score) $inc[`${visitation}.$.score`] = score;
      if (hit) $inc[`${visitation}.$.hit`] = hit;
      if (error) $inc[`${visitation}.$.error`] = error;

      await client
        .db()
        .collection(COLLECTIONS.MATCH)
        .updateOne(queryCondition, { $inc });
    }

    return {
      success: true,
      message: 'Score board updated',
    };
  } catch (err) {
    throw err;
  }
}

const lookups = [
  {
    $lookup: {
      from: COLLECTIONS.TEAM,
      as: 'awayTeam',
      let: { awayTeamId: '$awayTeamId' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$awayTeamId'] },
          },
        },
        { $project: { name: 1, logoUrl: 1, abbreviation: 1, color: 1 } },
      ],
    },
  },
  {
    $lookup: {
      from: COLLECTIONS.TEAM,
      as: 'homeTeam',
      let: { homeTeamId: '$homeTeamId' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$homeTeamId'] },
          },
        },
        { $project: { name: 1, logoUrl: 1, abbreviation: 1 } },
      ],
    },
  },
];

export async function list(cacheKey) {
  try {
    const matches = await client
      .db()
      .collection(COLLECTIONS.MATCH)
      .aggregate([
        ...lookups,
        {
          $project: {
            league: 1,
            startAt: 1,
            endAt: 1,
            awayTeam: { $arrayElemAt: ['$awayTeam', 0] },
            homeTeam: { $arrayElemAt: ['$homeTeam', 0] },
          },
        },
      ])
      .toArray();

    const response = {
      success: true,
      data: matches,
    };

    await cache.set(cacheKey, response, CACHE_DURATION);

    return response;
  } catch (err) {
    throw err;
  }
}

async function getMatch(_id) {
  try {
    _id = typeof _id === 'string' ? new ObjectId(_id) : _id;
    const match = await client
      .db()
      .collection(COLLECTIONS.MATCH)
      .aggregate([
        { $match: { _id } },
        ...lookups,
        {
          $project: {
            league: 1,
            awayTeamScore: 1,
            homeTeamScore: 1,
            startAt: 1,
            endAt: 1,
            awayTeam: { $arrayElemAt: ['$awayTeam', 0] },
            homeTeam: { $arrayElemAt: ['$homeTeam', 0] },
          },
        },
      ])
      .toArray();
    return match[0];
  } catch (err) {
    throw err;
  }
}

export async function view({ _id }: any, cacheKey) {
  try {
    const match = await getMatch(_id);

    const response = {
      success: true,
      data: match,
    };

    await cache.set(cacheKey, response, CACHE_DURATION);

    return response;
  } catch (err) {
    throw err;
  }
}

export async function viewScore({ _id }: any) {
  try {
    const match = await client.db().collection(COLLECTIONS.MATCH)
      .findOne(
        {_id : new ObjectId(_id)},
        { projection : {awayTeamScore:1, homeTeamScore:1} }
      );

    if(!match) throw new NotFoundError("Match not found");
    const homeTeamScores:any = match.homeTeamScore;
    const awayTeamScores:any = match.awayTeamScore;
    const maxRound = Math.max(awayTeamScores.length, homeTeamScores.length);
    const totalScore = {
      awayTeamScore : {
        scores : [],
        hit : 0,
        error : 0,
        total : 0
      },

      homeTeamScore : {
        scores : [],
        hit : 0,
        error : 0,
        total : 0
      }
    };


    for(let i=0; i<maxRound; i++){
      const homeTeamData = homeTeamScores[i] || {};
      totalScore.homeTeamScore.scores.push(homeTeamData.score || 0);
      totalScore.homeTeamScore.hit+=homeTeamData.hit || 0;
      totalScore.homeTeamScore.error+=homeTeamData.error || 0; 
      totalScore.homeTeamScore.total+=homeTeamData.score || 0;   
    
      const awayTeamData = awayTeamScores[i] || {};
      totalScore.awayTeamScore.scores.push(awayTeamData.score || 0);
      totalScore.awayTeamScore.hit+=awayTeamData.hit || 0;
      totalScore.awayTeamScore.error+=awayTeamData.error || 0; 
      totalScore.awayTeamScore.total+=awayTeamData.score || 0;       
    }

    return {
      success : true,
      data : totalScore
    };
  } catch (err) {
    throw err;
  }
}
