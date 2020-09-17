import client from '../../utils/db';
import { COLLECTIONS } from '../../utils/constants';
import { ObjectId } from 'mongodb';
import { NotFoundError, paginate, ExistsError } from 'iyasunday';

export async function create(body) {
  try {
    const teamExists = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .countDocuments({ name: body.name });
    if (teamExists) throw new ExistsError(body.name + ' already exists');
    body.createdAt = new Date();
    const team = await client.db().collection(COLLECTIONS.TEAM).insertOne(body);

    return {
      success: true,
      data: team.ops[0],
    };
  } catch (err) {
    throw err;
  }
}

export async function update({ _id }: any, body) {
  try {
    _id = new ObjectId(_id);
    const teamExists = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .countDocuments({ $and: [{ _id: { $ne: _id } }, { name: body.name }] });
    if (teamExists) throw new ExistsError(body.name + ' already exists');

    const team = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .findOneAndUpdate(
        { _id },
        {
          $set: { ...body },
        },
        {
          returnOriginal: false,
        }
      );

    if (!team.value) throw new NotFoundError('Team not found');

    return {
      success: true,
      data: team.value,
    };
  } catch (err) {
    throw err;
  }
}

export async function list({ limit, pageId }: any) {
  try {
    const totalCount = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .countDocuments();
    const { offset, pageCount } = paginate(totalCount, pageId, limit);
    const teams = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .find({}, { projection: { name: 1, abbreviation: 1, logoUrl: 1 } })
      .skip(offset)
      .limit(limit)
      .toArray();

    return {
      success: true,
      data: {
        teams,
        pageCount,
        pageId,
        limit,
        totalCount,
      },
    };
  } catch (err) {
    throw err;
  }
}

export async function remove(params) {
  try {
    const team = await client
      .db()
      .collection(COLLECTIONS.TEAM)
      .findOneAndDelete({ _id: new ObjectId(params._id) });

    if (!team.value) throw new NotFoundError('Team not found');

    return {
      success: true,
      data: team.value.name + ' removed',
    };
  } catch (err) {
    throw err;
  }
}
