import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { getContent, postContent } from '../utils';
import { useModal, useForm } from '../utils/hooks';
import MatchDetail from './matchDetail';
import moment from 'moment';

export default ({ TabContent }) => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const Modal = useModal();
  const createMatch = useForm(addMatch);
  const [isLoading, setIsLoading] = useState(true);
  let display;

  const getFixtures = useCallback(async () => {
    try {
      const [matches, teams] = await Promise.all([
        getContent({ url: '/matches' }),
        getContent({ url: '/teams' }),
      ]);
      setMatches(matches.data);
      setTeams(teams.data.teams);
      setIsLoading(false);
    } catch ({ message }) {
      setIsLoading(false);
      alert(message);
    }
  }, []);

  useEffect(() => {
    getFixtures();
  }, [getFixtures]);

  async function addMatch() {
    try {
      const match = await postContent({
        url: '/match',
        data: createMatch.values,
      });
      setMatches([...matches,match.data]);
      Modal.close();
    } catch ({ message }) {
      alert(message);
    }
  }

  if (isLoading) display = <h3>Loading.....</h3>;
  else if (matches.length === 0) display = <h1>No match found</h1>;
  else if (matches.length > 0) {
    display = (
      <div className="cardWrapper">
        {matches.map((match) => (
          <div
            key={match._id}
            className="fixture"
            onClick={() =>
              TabContent.display(
                <MatchDetail matchId={match._id} league={match.league} endAt={match.endAt} />
              )
            }
          >
            <div className="fixtureTeam">
              <img
                alt={match.awayTeam.name}
                src={match.awayTeam.logoUrl}
                className="fixtureTeamImage"
              />
              <div>
                <h3>{match.awayTeam.abbreviation}</h3>
                <p className="visiting">(Away team)</p>
              </div>
            </div>
            <h1>VS</h1>
            <div className="fixtureTeam">
              <img
                alt={match.homeTeam.name}
                src={match.homeTeam.logoUrl}
                className="fixtureTeamImage"
              />
              <div>
                <h3>{match.homeTeam.abbreviation}</h3>
                <p className="visiting">(Home team)</p>
              </div>
            </div>

            <p className="matchTime">
              {match.league} :: {moment(new Date(match.startAt)).calendar()}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Fragment>
      {display}
      <button className="addButton" onClick={Modal.open}>
        Add New Match
      </button>

      <Modal.Panel
        isOpen={Modal.openModal}
        onRequestClose={Modal.close}
        style={Modal.defaultStyle}
      >
        <form onSubmit={createMatch.submit}>
          <h3>Add new match</h3>
          <select
            onChange={createMatch.getData}
            className="formInput"
            name="league"
          >
            <option value="">Select League</option>
            <option value="NBA">NBA</option>
            <option value="MLB">MLB</option>
          </select>
          <select
            onChange={createMatch.getData}
            className="formInput"
            name="awayTeamId"
          >
            <option value="">Select away team</option>
            {teams.map(({ _id, name }) => (
              <option key={_id} value={_id}>
                {name}
              </option>
            ))}
          </select>
          <select
            onChange={createMatch.getData}
            className="formInput"
            name="homeTeamId"
          >
            <option value="">Select home team</option>
            {teams.map(({ _id, name }) => (
              <option key={_id} value={_id}>
                {name}
              </option>
            ))}
          </select>
          <input
            className="formInput"
            name="startAt"
            onChange={createMatch.getData}
            type="datetime-local"
            placeholder="Enter match name"
            required
          />
          <input
            className="formInput"
            name="endAt"
            onChange={createMatch.getData}
            type="datetime-local"
            placeholder="Enter match name"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </Modal.Panel>
    </Fragment>
  );
};
