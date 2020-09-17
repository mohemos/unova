import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  getContent,
  getMatchScore,
  isActiveMatch,
  isUpcomingMatch,
} from '../utils';
import { useModal } from '../utils/hooks';
import MatchPlayers from './matchPlayer';
import BoxScore from './boxScore';
import AddScore from './addScore';
import moment from 'moment';
import { useTimer } from 'react-timer-hook';

export default ({ matchId, league, endAt }) => {
  const [matchDetails, setMatchDetails] = useState({});
  const [matchScores, setMatchScores] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const Modal = useModal();
  let display;
  const {
    seconds,
    minutes,
    hours
  } = useTimer({ expiryTimestamp : new Date(endAt)});

  const getMatchDetails = useCallback(async () => {
    try {
      const [match, matchScores] = await Promise.all([
        getContent({ url: '/match/' + matchId }),
        getMatchScore(matchId),
      ]);
      setMatchDetails(match.data);
      setMatchScores(matchScores);
      setIsLoading(false);
    } catch ({ message }) {
      setIsLoading(false);
      alert(message);
    }
  }, [matchId]);

  useEffect(() => {
    getMatchDetails();
  }, [getMatchDetails]);

  if (isLoading) display = <h1>Loading match data, please wait.....</h1>;
  else if (isUpcomingMatch(matchDetails.startAt)) {
    display = (
      <MatchPlayers
        awayTeam={matchDetails.awayTeam}
        homeTeam={matchDetails.homeTeam} 
        startAt = {matchDetails.startAt}
      />
    );
  } else if (isActiveMatch(matchDetails.startAt, matchDetails.endAt)) {
    display = (
      <div> 
      <h3 className="matchStartTime">Match ends in : {hours}H: {minutes}M: {seconds}S </h3>
        <BoxScore
          scores={matchScores}
          league={league}
          awayTeamName={matchDetails.awayTeam.abbreviation}
          homeTeamName={matchDetails.homeTeam.abbreviation}
        />
        <button className="addButton" onClick={Modal.open}>Add Score</button>
      </div>
    );
  } else {
    return (
      <Fragment>
        <h3 className="matchStartTime">Match played : {moment(matchDetails.startAt).calendar()} </h3>
        <BoxScore
          scores={matchScores}
          league={league}
          awayTeamName={matchDetails.awayTeam.abbreviation}
          homeTeamName={matchDetails.homeTeam.abbreviation}
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      {display}
      {matchDetails.awayTeam && (
        <Modal.Panel
          isOpen={Modal.openModal}
          onRequestClose={Modal.close}
          style={Modal.defaultStyle}
        >
          <AddScore
            matchDetails={matchDetails}
            matchScores={matchScores}
            setMatchScores={setMatchScores}
          />
        </Modal.Panel>
      )}
    </Fragment>
  );
};
