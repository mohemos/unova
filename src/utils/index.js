import Axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

export async function getContent({ url, method = 'GET' }) {
  try {
    const headers = { 'X-Requested-With': 'XMLHttpRequest' };

    const result = await Axios({
      method,
      url: BASE_URL + url,
      headers,
    });

    return result.data;
  } catch (err) {
    errorMessage(err);
  }
}

export async function postContent({ url, data, method = 'POST' }) {
  try {
    const headers = { 'X-Requested-With': 'XMLHttpRequest' };

    const result = await Axios({
      method,
      url: BASE_URL + url,
      data,
      headers,
    });

    return result.data;
  } catch (err) {
    errorMessage(err);
  }
}

export function errorMessage(err = void 0) {
  let message;
  if (err.response) {
    message = err.response.data.message;
  } else if (err.message) {
    message = err.message;
  } else {
    message = 'Something went wrong';
  }
  throw new Error(message);
}

export function isUpcomingMatch(startAt) {
  const matchStartAt = new Date(startAt).getTime();
  return matchStartAt > Date.now() ? true : false;
}

export function isActiveMatch(startAt, endAt) {
  const matchStartAt = new Date(startAt).getTime();
  const matchendAt = new Date(endAt).getTime();
  return matchStartAt < Date.now() && matchendAt > Date.now() ? true : false;
}

export async function getTeamPlayers(teamId) {
  try {
    const players = await getContent({ url: `/team/${teamId}/players` });
    return players.data;
  } catch (err) {
    throw err;
  }
}

export async function getMatchScore(matchId) {
  try {
    const players = await getContent({ url: `/match/${matchId}/score` });
    return players.data;
  } catch (err) {
    throw err;
  }
}
