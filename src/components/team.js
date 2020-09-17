import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { getContent, postContent } from '../utils';
import { useModal, useForm } from '../utils/hooks';
import Players from './player';

export default ({ TabContent }) => {
  const [teams, setTeams] = useState([]);
  const Modal = useModal();
  const createTeam = useForm(addTeam);
  const [isLoading, setIsLoading] = useState(true);
  let display;

  const getTeams = useCallback(async () => {
    try {
      const teams = await getContent({ url: '/teams' });
      setTeams(teams.data.teams);
      setIsLoading(false);
    } catch ({ message }) {
      setIsLoading(false);
      alert(message);
    }
  }, []);

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  async function addTeam() {
    try {
      const team = await postContent({
        url: '/team',
        data: createTeam.values,
      });
      setTeams([team.data, ...teams]);
      Modal.close();
    } catch ({ message }) {
      alert(message);
    }
  }

  if (isLoading) display = <h3>Loading.....</h3>;
  else if (teams.length === 0) display = <h1>No team found</h1>;
  else {
    display = (
      <div className="cardWrapper">
        {teams.map((team) => (
          <div
            className="card"
            onClick={() => {
              TabContent.display(<Players teamId={team._id} />);
            }}
          >
            <img alt={team.name} src={team.logoUrl} className="cardImage" />
            <h4>{team.name}</h4>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Fragment>
      {display}
      <button className="addButton" onClick={Modal.open}>
        Add New Team
      </button>

      <Modal.Panel
        isOpen={Modal.openModal}
        onRequestClose={Modal.close}
        style={Modal.defaultStyle}
      >
        <form onSubmit={createTeam.submit}>
          <h3>Add new team</h3>
          <input
            className="formInput"
            name="name"
            onChange={createTeam.getData}
            type="text"
            placeholder="Enter team name"
            required
          />
          <input
            className="formInput"
            name="abbreviation"
            onChange={createTeam.getData}
            type="text"
            placeholder="Enter team abbreviation"
            required
          />
          <input
            className="formInput"
            name="logoUrl"
            onChange={createTeam.getData}
            type="url"
            placeholder="Enter team logo url"
            required
          />
          <label>Team Color</label>
          <input
            className="formInput"
            name="color"
            onChange={createTeam.getData}
            type="color"
            placeholder="Enter team color"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </Modal.Panel>
    </Fragment>
  );
};
