/* eslint-disable no-unused-vars -- getFinancialAdvice reserved for future UI */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import LifeSmartLogo from '../../../../assets/icons/LifeSmartLogo.png';

const ResultsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teams, teamData, quarterResults } = location.state || {};
  const [expandedGroups, setExpandedGroups] = useState({});
  const chartRefs = useRef({});
  const chartInstances = useRef({});

  const fixedColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8B0000', '#00FF7F', '#FFD700', '#4682B4'
  ];

  useEffect(() => {
    // Initialize expanded state for all teams
    if (teams) {
      const initialExpanded = teams.reduce((acc, team) => {
        acc[team] = true;
        return acc;
      }, {});
      setExpandedGroups(initialExpanded);
    }
  }, [teams]);

  useEffect(() => {
    // Cleanup function to destroy all charts when component unmounts
    const instances = chartInstances.current;
    return () => {
      Object.values(instances).forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, []);

  const createChart = (team) => {
    if (!quarterResults || !teamData[team]) return;

    // Find the team's data in quarterResults
    const teamQuarterData = quarterResults.find(qr => qr.name === team);
    if (!teamQuarterData) return;

    // Destroy existing chart if it exists
    if (chartInstances.current[team]) {
      chartInstances.current[team].destroy();
    }

    const ctx = chartRefs.current[team]?.getContext('2d');
    if (!ctx) return;

    const assetTypes = ['equity', 'bonds', 'realestate', 'commodities', 'other'];
    const numberOfQuarters = teamQuarterData.equity.length;
    const labels = Array.from({ length: numberOfQuarters }, (_, i) => `Q${i}`);

    const datasets = assetTypes.map((assetType, index) => ({
      label: assetType.charAt(0).toUpperCase() + assetType.slice(1),
      data: teamQuarterData[assetType],
      borderColor: fixedColors[index % fixedColors.length],
      fill: false,
      tension: 0.4
    }));

    const chartConfig = {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 12 }
            }
          },
          title: {
            display: true,
            text: `${team}'s Portfolio Performance`,
            font: { size: 14 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => '£' + value.toLocaleString()
            }
          }
        }
      }
    };

    chartInstances.current[team] = new Chart(ctx, chartConfig);
  };

  useEffect(() => {
    // Create/update charts when groups are expanded
    Object.entries(expandedGroups).forEach(([team, isExpanded]) => {
      if (isExpanded) {
        setTimeout(() => createChart(team), 100);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- createChart uses refs/state
  }, [expandedGroups, quarterResults]);

  const calculateTotalScore = (team) => {
    if (!teamData || !teamData[team]) return 0;
    
    const totalValue = teamData[team].equity +
                      teamData[team].bonds +
                      teamData[team].realestate +
                      teamData[team].commodities +
                      teamData[team].other;
    
    return totalValue;
  };

  const getTeamRank = (team) => {
    if (!teams || !teamData) return 'N/A';
    
    const scores = teams.map(t => ({
      team: t,
      score: calculateTotalScore(t)
    }));
    
    scores.sort((a, b) => b.score - a.score);
    
    const rank = scores.findIndex(s => s.team === team) + 1;
    return rank;
  };

  // Reserved for future financial advice display (currently commented out in JSX)
  const getFinancialAdvice = (team) => {
    if (!teamData || !teamData[team]) return 'No data available for financial advice.';
    
    const data = teamData[team];
    const totalValue = calculateTotalScore(team);
    
    if (data.equity < totalValue * 0.2) {
      return 'Consider increasing your equity investments for better long-term growth potential.';
    } else if (data.bonds < totalValue * 0.2) {
      return 'You might want to add more bonds to your portfolio for stability.';
    } else if (data.realestate > totalValue * 0.5) {
      return 'Your portfolio is heavily weighted in real estate. Consider diversifying into other assets.';
    } else {
      return 'Your portfolio appears well-diversified. Continue monitoring and rebalancing as needed.';
    }
  };

  const toggleGroup = (team) => {
    setExpandedGroups(prev => ({
      ...prev,
      [team]: !prev[team]
    }));
  };

  const restartGame = () => {
    navigate('/adult-simulation-setup');
  };

  if (!teams || !teamData) {
    return (
      <div className="simulation-results-error">
        <h2>No simulation data available</h2>
        <p>Please complete a simulation first to see results.</p>
        <button onClick={restartGame} className="simulation-results-restart-button">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="simulation-results-screen">
      <header className="simulation-results-header">
        <img src={LifeSmartLogo} alt="Logo" className="simulation-results-logo" />
        <div>
          <button className="simulation-results-calculator-toggle">
            <i className="fas fa-calculator"></i>
          </button>
        </div>
      </header>

      <h1 className="simulation-results-title">
        <i className="fas fa-chart-line simulation-results-icon"></i>
        Investment Results
      </h1>

      <div className="simulation-results-container">
        {teams.map((team, index) => {
          const rank = getTeamRank(team);
          const totalValue = calculateTotalScore(team);
          const isExpanded = expandedGroups[team];
          const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';

          return (
            <div 
              key={team} 
              className={`simulation-results-group ${rankClass}`}
              onClick={() => toggleGroup(team)}
            >
              <h2>{rank}. {team} (${totalValue.toFixed(2)})</h2>
              {isExpanded && (
                <div className="simulation-results-details">
                  <div className="simulation-results-details-content">
                    <ul className="simulation-results-asset-list">
                      <li>Equity: ${teamData[team].equity.toFixed(2)}</li>
                      <li>Bonds: ${teamData[team].bonds.toFixed(2)}</li>
                      <li>Real Estate: ${teamData[team].realestate.toFixed(2)}</li>
                      <li>Commodities: ${teamData[team].commodities.toFixed(2)}</li>
                      <li>Other: ${teamData[team].other.toFixed(2)}</li>
                      <li>Total Portfolio Value: ${totalValue.toFixed(2)}</li>
                    </ul>
                    <div className="simulation-results-chart-container">
                      <canvas 
                        ref={el => chartRefs.current[team] = el}
                        className="simulation-results-chart"
                      />
                    </div>
                    {/* <div className="simulation-results-financial-advice">
                      <h4>Financial Advice:</h4>
                      <p>{getFinancialAdvice(team)}</p>
                    </div> */}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={restartGame} className="simulation-results-restart-button">
        Restart Simulation
      </button>
    </div>
  );
};

export default ResultsScreen; 