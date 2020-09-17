import { errorMessage } from 'iyasunday';
import { get as getCache } from './cache';
export function parseJSON(value: string): any {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

export async function checkCache(req, res, next) {
  try {
    const cachedMateches = await getCache(
      `${req.get('HOST')}${req.originalUrl}`
    );
    if (cachedMateches) {
      return res.status(200).json(cachedMateches);
    }
    next();
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}
