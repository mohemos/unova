import React from 'react';

export default ({ scores, awayTeamName, homeTeamName, league }) => {
  if (!scores || !scores.awayTeamScore) {
    return <h1>No score found</h1>;
  }

  const { awayTeamScore, homeTeamScore } = scores;
  let tableHead = [<th className="bgColor borderRight"></th>];
  let awayTeamScoreHolder = [
    <td className="bgColor borderRight">{awayTeamName}</td>,
  ];
  let homeTeamScoreHolder = [
    <td className="bgColor borderRight">{homeTeamName}</td>,
  ];
  let totalAwayScore = 0;
  let totalHomeScore = 0;
  let defaultRounds = league === 'NBA' ? 4 : 9;
  let maxRounds =
    Math.max(awayTeamScore.scores.length, homeTeamScore.scores.length) ||
    defaultRounds;

  for (let round = 0; round < maxRounds; round++) {
    tableHead.push(<th>{round + 1}</th>);
    awayTeamScoreHolder.push(<td>{awayTeamScore.scores[round] || 0}</td>);
    homeTeamScoreHolder.push(<td>{homeTeamScore.scores[round] || 0}</td>);

    totalAwayScore += awayTeamScore.scores[round] || 0;
    totalHomeScore += homeTeamScore.scores[round] || 0;
  }

  tableHead.push(<th className="bgColor borderLeft">T</th>);
  awayTeamScoreHolder.push(
    <td className="bgColor borderLeft">{totalAwayScore}</td>
  );
  homeTeamScoreHolder.push(
    <td className="bgColor borderLeft">{totalHomeScore}</td>
  );

  if (league === 'MLB') {
    tableHead.push(<th className="bgColor borderLeft">H</th>);
    awayTeamScoreHolder.push(
      <td className="bgColor borderLeft">{awayTeamScore.hit || 0}</td>
    );
    homeTeamScoreHolder.push(
      <td className="bgColor borderLeft">{homeTeamScore.hit || 0}</td>
    );

    tableHead.push(<th className="bgColor borderLeft">E</th>);
    awayTeamScoreHolder.push(
      <td className="bgColor borderLeft">{awayTeamScore.error || 0}</td>
    );
    homeTeamScoreHolder.push(
      <td className="bgColor borderLeft">{homeTeamScore.error || 0}</td>
    );
  }

  return (
    <table className="tableHolder">
      <thead className="scoreRow borderBottom">
        <tr>{tableHead}</tr>
      </thead>
      <tbody className="scoreRow">
        <tr>{awayTeamScoreHolder}</tr>
        <tr>{homeTeamScoreHolder}</tr>
      </tbody>
    </table>
  );
};
