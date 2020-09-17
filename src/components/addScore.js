import React from 'react';
import { postContent } from '../utils';
import { useForm } from '../utils/hooks';
import moment from 'moment';

export default ({ matchDetails, matchScores, setMatchScores }) => {
  const { league, homeTeam, awayTeam, _id } = matchDetails;
  const addScoreForm = useForm(addScore);
  let maxRound = league === 'NBA' ? 4 : 30;
  const rounds = [];

  for (let round = 1; round <= maxRound; round++) {
    rounds.push(
      <option value={round}>
        {moment.localeData().ordinal(round)}{' '}
        {league === 'NBA' ? 'Quater' : 'Inning'}{' '}
      </option>
    );
  }

  async function addScore() {
    try {
      console.log(addScoreForm.values);
      const { visitation,scoreType="score" } = addScoreForm.values;
      const round = Number(addScoreForm.values.round);
      const score = Number(addScoreForm.values.score);
      const data = addScoreForm.values;

      if (league === 'MLB') {
        delete data.score;
        data[scoreType] = score;
        delete data.scoreType;
      }

      await postContent({
        url: `/match/${_id}/score`,
        data,
      });

      if(scoreType === 'score'){
        if (matchScores[visitation]['scores'].length >= round) {
          matchScores[visitation]['scores'][round - 1] =
            matchScores[visitation]['scores'][round - 1] + score;
        } else {
          matchScores[visitation]['scores'][round - 1] = score;
        }
      } else{
        matchScores[visitation][scoreType] = matchScores[visitation][scoreType] + score;
      }

      setMatchScores(matchScores);
    } catch ({ message }) {
      alert(message);
    }
  }

  return (
    <form onSubmit={addScoreForm.submit}>
      <div className="teamPosition">
        <label>
          <input
            onChange={addScoreForm.getData}
            name="visitation"
            type="radio"
            value="awayTeamScore"
          />{' '}
          {awayTeam.abbreviation}
        </label>
        <label>
          <input
            onChange={addScoreForm.getData}
            name="visitation"
            type="radio"
            value="homeTeamScore"
          />{' '}
          {homeTeam.abbreviation}
        </label>
      </div>
      <select
        name="round"
        onChange={addScoreForm.getData}
        className="formInput" 
        required
      >
        <option>Select current round</option>
        {rounds}
      </select>

      {league === 'MLB' && (
        <select
          name="scoreType"
          onChange={addScoreForm.getData}
          className="formInput" 
          required
        >
          <option>Select record type</option>
          <option value="score">
            Score
          </option>
          <option value="error">Error</option>
          <option value="hit">Hit</option>
        </select>
      )}

      <input
        className="formInput"
        name="score"
        onChange={addScoreForm.getData}
        type="text"
        placeholder="Enter score"
        required
      />
      <button>Submit score</button>
    </form>
  );
};
