import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { getTeamPlayers, postContent } from '../utils';
import { useModal, useForm } from '../utils/hooks';

export default ({ teamId }) => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const Modal = useModal();
  const createPlayer = useForm(addPlayer);
  let display;

  const getPlayers = useCallback(async () => {
    try {
      setPlayers(await getTeamPlayers(teamId));
      setIsLoading(false);
    } catch ({ message }) {
      setIsLoading(false);
      alert(message);
    }
  }, [teamId]);

  useEffect(() => {
    getPlayers();
  }, [getPlayers]);

  async function addPlayer() {
    try {
      const player = await postContent({
        url: `/team/${teamId}/player`,
        data: createPlayer.values,
      });
      setPlayers([player.data, ...players]);
      Modal.close();
    } catch ({ message }) {
      setIsLoading(false);
      alert(message);
    }
  }

  if (isLoading) display = <h1>Loading....</h1>;
  else if (players.length === 0) display = <h1>No player found</h1>;
  else {
    display = (
      <div className="cardWrapper">
        {players.map((player) => (
          <div className="card">
            <img
              alt={player.firstName}
              src={player.imageUrl}
              className="cardImage"
            />
            <h4>{player.firstName + ' ' + player.lastName}</h4>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Fragment>
      {display}
      <button className="addButton" onClick={Modal.open}>
        Add New Player
      </button>

      <Modal.Panel
        isOpen={Modal.openModal}
        onRequestClose={Modal.close}
        style={Modal.defaultStyle}
      >
        <form onSubmit={createPlayer.submit}>
          <h3>Add new player</h3>
          <input
            className="formInput"
            name="firstName"
            onChange={createPlayer.getData}
            type="text"
            placeholder="Enter player first name"
            required
          />
          <input
            className="formInput"
            name="lastName"
            onChange={createPlayer.getData}
            type="text"
            placeholder="Enter player last name"
            required
          />
          <input
            className="formInput"
            name="imageUrl"
            onChange={createPlayer.getData}
            type="url"
            placeholder="Enter player image url"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </Modal.Panel>
    </Fragment>
  );
};
