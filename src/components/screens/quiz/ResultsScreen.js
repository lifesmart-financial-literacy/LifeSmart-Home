import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultsScreen.css';
import crownIcon from '../../../assets/icons/crown.png';

const ResultsScreen = ({ teams, quizComplete, onNextQuestion }) => {
  const [barWidths, setBarWidths] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [rankedTeams, setRankedTeams] = useState([]);
  const navigate = useNavigate();
  const maxPoints = 23;

  // Calculate sorted and ranked teams
  useEffect(() => {
    if (!teams || teams.length === 0) return;

    // First sort the teams
    const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
    
    // Then calculate ranks
    const ranked = sortedTeams.map((team, index) => {
      // If it's the first team or has different points than the previous team
      if (index === 0 || team.points !== sortedTeams[index - 1].points) {
        return { ...team, rank: index + 1 };
      }
      // If it has the same points as the previous team, use the same rank
      return { ...team, rank: sortedTeams[index - 1].rank };
    });

    setRankedTeams(ranked);
  }, [teams]);

  const calculateBarWidth = (points) => {
    return (points / maxPoints) * 100;
  };

  const toggleTeamExpansion = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  const goHome = () => {
    navigate('/');
  };

  const nextOrNavigateToSimulation = () => {
    if (!quizComplete) {
      onNextQuestion();
    }
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
    <div className="results-container">
      <button onClick={goHome} className="home-button">Go to Home</button>
      
      <h2 className="title">Scoreboard</h2>

      <div className="content-wrapper">
        <div className="team-results">
          {rankedTeams.map((team, index) => (
            <div
              key={team.name}
              className={`team-bar-container ${expandedTeam === team.name ? 'expanded' : ''} ${team.rank === 1 ? 'winning-team' : ''}`}
              style={{
                backgroundColor: team.rank === 1 ? '#C5FF9A' : '',
                color: team.rank === 1 ? 'black' : ''
              }}
              onClick={() => toggleTeamExpansion(team.name)}
            >
              <div className="team-bar">
                <p className="team-name">
                  {team.rank}. {team.name}
                  {team.rank === 1 && (
                    <img src={crownIcon} alt="Crown" className="crown-icon" />
                  )}
                </p>
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{
                      width: `${barWidths[team.name]}%`,
                      transitionDelay: `${index * 0.2}s`
                    }}
                  />
                </div>
                <div className="points-info">
                  <p className="points" style={{ color: team.rank === 1 ? 'black' : 'white' }}>
                    ⚡ {team.points}
                  </p>
                </div>
              </div>

              {expandedTeam === team.name && (
                <div className="team-points-breakdown">
                  <table>
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(team.taskScores || {}).map(([task, points]) => (
                        <tr key={task}>
                          <td>Task {task}</td>
                          <td>{points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          
          <div className="next-button-container">
            <button className="next-button" onClick={nextOrNavigateToSimulation}>
              {quizComplete ? 'See Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen; 