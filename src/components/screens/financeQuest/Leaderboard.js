import React, { useState, useEffect } from 'react';

const Leaderboard = ({ teams, quizComplete, onNextQuestion }) => {
  const [, setBarWidths] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [rankedTeams, setRankedTeams] = useState([]);
  const maxPoints = 23;

  // Calculate sorted and ranked teams
  useEffect(() => {
    if (!teams || teams.length === 0) return;

    // First sort the teams by points in descending order
    const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
    
    let currentRank = 1;
    let prevPoints = null;
    
    // Then calculate ranks, handling ties correctly
    const ranked = sortedTeams.map((team, index) => {
      // If this is the first team or has different points than previous team
      if (index === 0 || team.points !== prevPoints) {
        currentRank = index + 1;
      }
      
      prevPoints = team.points;
      return { ...team, rank: currentRank };
    });

    setRankedTeams(ranked);
  }, [teams]);

  const calculateBarWidth = (points) => {
    return (points / maxPoints) * 100;
  };

  const handleExpand = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  useEffect(() => {
    if (!rankedTeams || rankedTeams.length === 0) return;

    // Set initial widths to 0 for animation
    const initialWidths = {};
    rankedTeams.forEach(team => {
      initialWidths[team.name] = 0;
    });
    setBarWidths(initialWidths);

    // Animate bar widths with cascading delays
    setTimeout(() => {
      rankedTeams.forEach((team, index) => {
        setTimeout(() => {
          setBarWidths(prev => ({
            ...prev,
            [team.name]: calculateBarWidth(team.points)
          }));
        }, index * 300);
      });
    }, 200);
  }, [rankedTeams]);

  return (
    <div className="pixel-leaderboard-bg">
      <div className="pixel-leaderboard-header-outer">
        <img src="/financeQuest/icons/8bitRedFlag.png" alt="flag" className="pixel-leaderboard-flag-img" />
        <span className="pixel-leaderboard-title">LEADERBOARD</span>
      </div>
      <div className="pixel-leaderboard-card">
        <div className="pixel-leaderboard-table-wrapper">
          <table className="pixel-leaderboard-table">
            <tbody>
              {rankedTeams.map((team, idx) => [
                <tr key={team.name} className="pixel-leaderboard-row" onClick={() => handleExpand(team.name)} style={{ cursor: 'pointer' }}>
                  <td className="pixel-leaderboard-rank">{idx + 1}.</td>
                  <td className="pixel-leaderboard-team">{team.name}</td>
                  <td className="pixel-leaderboard-points">{team.points} POINTS</td>
                </tr>,
                expandedTeam === team.name && (
                  <tr key={team.name + '-expanded'} className="pixel-leaderboard-breakdown-row">
                    <td colSpan={3}>
                      <table className="pixel-leaderboard-breakdown-table">
                        <thead>
                          <tr>
                            <th>Question</th>
                            <th>Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.taskScores && Object.entries(team.taskScores).map(([q, pts]) => (
                            <tr key={q}>
                              <td>Q{q}</td>
                              <td>{pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )
              ])}
            </tbody>
          </table>
        </div>
        <img src="/financeQuest/icons/8bitStar.png" alt="star" className="pixel-leaderboard-star" />
      </div>
      <button className="pixel-leaderboard-next-btn" onClick={onNextQuestion}>NEXT</button>
    </div>
  );
};

export default Leaderboard; 