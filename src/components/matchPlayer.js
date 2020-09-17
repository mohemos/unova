import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { useTimer } from 'react-timer-hook';
import { getTeamPlayers } from '../utils';

export default ({ awayTeam, homeTeam, startAt }) => {
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [homePlayers, setHomePlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  
  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp: new Date(startAt).getTime(), onExpire: () => window.location.reload() });
  let display;

  const getPlayers = useCallback(async () => {
    try {
      const [awayTeamPlayers, homeTeamPlayers] = await Promise.all([
        getTeamPlayers(awayTeam._id),
        getTeamPlayers(homeTeam._id),
      ]);

      setAwayPlayers(awayTeamPlayers);
      setHomePlayers(homeTeamPlayers);
      setIsLoading(false);
    } catch ({ message }) {
      setIsLoading(false);
      alert(message);
    }
  }, [awayTeam, homeTeam]);

  useEffect(() => {
    getPlayers();
  }, [getPlayers]);

  if (isLoading) display = <h1>Loading....</h1>;
  else if (awayPlayers.length === 0) display = <h1>No player found</h1>;
  else {
    display = (
      <table className="matchPlayerTable" border="1">
        <thead>
          <tr>
            <th>{awayTeam.name} Players</th>
            <th>{homeTeam.name} Players</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {awayPlayers.map((player) => (
                <div key={player._id} className="teamPlayer">
                  <img src={player.imageUrl} alt={player.firstName} />
                  <p>
                    {player.firstName} {player.lastName}
                  </p>
                </div>
              ))}
            </td>
            <td>
                {homePlayers.map((player) => (
                  <div key={player._id} className="teamPlayer">
                    <img src={player.imageUrl} alt={player.firstName} />
                    <p>
                      {player.firstName} {player.lastName}
                    </p>
                  </div>
                ))}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return <Fragment>
    <h3 className="matchStartTime">Match starts : {days}D: {hours}H: {minutes}M: {seconds}S </h3>
    {display}
    </Fragment>;
};
