import client from '../../utils/db';
import { COLLECTIONS } from '../../utils/constants';
import { ObjectId } from 'mongodb';
import { NotFoundError, paginate, ExistsError } from 'iyasunday';

export async function create({ teamId }: any, body) {
  try {
    body._id = new ObjectId();
    const team = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .findOneAndUpdate(
        { _id: new ObjectId(teamId) },
        {
          $push: { players: body },
        },
        {
          returnOriginal: false,
        }
      );

    return {
      success: true,
      data: team.value.players.pop(),
    };
  } catch (err) {
    throw err;
  }
}

export async function list(params) {
  try {
    const team = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .findOne(
        { _id: new ObjectId(params.teamId) },
        { projection: { players: 1 } }
      );

    return {
      success: true,
      data: team.players,
    };
  } catch (err) {
    throw err;
  }
}

export async function remove({ teamId, _id }: any) {
  try {
    const team = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .updateOne(
        { _id: new ObjectId(teamId) },
        {
          $pull: { players: { _id: new ObjectId(_id) } },
        }
      );

    if (team.result.nModified === 0) throw new NotFoundError('Team not found');

    return {
      success: true,
      data: 'Player removed',
    };
  } catch (err) {
    throw err;
  }
}
