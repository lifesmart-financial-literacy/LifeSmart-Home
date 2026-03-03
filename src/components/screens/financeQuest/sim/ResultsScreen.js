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
      <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-[#1a1a1a] text-white">
        <h2 className="text-[#CB0E38] mb-4 text-[2rem]">No simulation data available</h2>
        <p className="text-[#888] mb-8 text-[1.1rem]">Please complete a simulation first to see results.</p>
        <button onClick={restartGame} className="py-3 px-6 text-[1.1rem] text-white bg-[#CB0E38] border-none rounded-lg cursor-pointer transition-all duration-300 block hover:bg-[#a30b2d] hover:-translate-y-0.5">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-10 font-['Helvetica_Neue',Arial,sans-serif] bg-[#F6F2EF] min-h-screen">
      <header className="flex justify-between items-center p-5 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <img src={LifeSmartLogo} alt="Logo" className="h-10" />
        <div>
          <button className="bg-none border-none text-2xl text-[#172b4d] cursor-pointer">
            <i className="fas fa-calculator"></i>
          </button>
        </div>
      </header>

      <h1 className="text-center text-[#172b4d] text-[2.5rem] my-8 flex items-center justify-center gap-4">
        <i className="fas fa-chart-line text-[#CB0E38] text-[2rem]"></i>
        Investment Results
      </h1>

      <div className="flex flex-col gap-5 items-center w-full max-w-[1200px] mx-auto">
        {teams.map((team, index) => {
          const rank = getTeamRank(team);
          const totalValue = calculateTotalScore(team);
          const isExpanded = expandedGroups[team];
          const rankClass = rank === 1 ? 'border-[#ffd700] shadow-[0_6px_10px_rgba(255,215,0,0.3)]' : rank === 2 ? 'border-[#c0c0c0] shadow-[0_6px_10px_rgba(192,192,192,0.3)]' : rank === 3 ? 'border-[#cd7f32] shadow-[0_6px_10px_rgba(205,127,50,0.3)]' : '';

          return (
            <div 
              key={team} 
              className={`bg-[#FAEDE4] border border-transparent rounded-lg p-5 shadow-[0_6px_10px_rgba(0,0,0,0.1)] transition-transform duration-300 cursor-pointer w-full hover:scale-[1.02] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] ${rankClass}`}
              onClick={() => toggleGroup(team)}
            >
              <h2 className="text-[#172b4d] text-[1.5rem] mb-6 flex justify-between items-baseline">{rank}. {team} (${totalValue.toFixed(2)})</h2>
              {isExpanded && (
                <div>
                  <div className="flex flex-row justify-between items-start gap-5 p-5 max-lg:flex-col max-lg:items-stretch">
                    <ul className="flex-1 list-none p-0 m-0">
                      <li className="block mb-2.5 py-4 px-4 text-[1.1rem] text-[#172b4d] bg-white rounded-lg transition-all duration-300 last:mb-0 hover:bg-[#f8f9fa] hover:translate-x-1">Equity: ${teamData[team].equity.toFixed(2)}</li>
                      <li className="block mb-2.5 py-4 px-4 text-[1.1rem] text-[#172b4d] bg-white rounded-lg transition-all duration-300 last:mb-0 hover:bg-[#f8f9fa] hover:translate-x-1">Bonds: ${teamData[team].bonds.toFixed(2)}</li>
                      <li className="block mb-2.5 py-4 px-4 text-[1.1rem] text-[#172b4d] bg-white rounded-lg transition-all duration-300 last:mb-0 hover:bg-[#f8f9fa] hover:translate-x-1">Real Estate: ${teamData[team].realestate.toFixed(2)}</li>
                      <li className="block mb-2.5 py-4 px-4 text-[1.1rem] text-[#172b4d] bg-white rounded-lg transition-all duration-300 last:mb-0 hover:bg-[#f8f9fa] hover:translate-x-1">Commodities: ${teamData[team].commodities.toFixed(2)}</li>
                      <li className="block mb-2.5 py-4 px-4 text-[1.1rem] text-[#172b4d] bg-white rounded-lg transition-all duration-300 last:mb-0 hover:bg-[#f8f9fa] hover:translate-x-1">Other: ${teamData[team].other.toFixed(2)}</li>
                      <li className="block mb-2.5 py-4 px-4 text-[1.1rem] text-[#172b4d] bg-white rounded-lg transition-all duration-300 last:mb-0 hover:bg-[#f8f9fa] hover:translate-x-1">Total Portfolio Value: ${totalValue.toFixed(2)}</li>
                    </ul>
                    <div className="flex-[2] bg-white p-5 rounded-lg h-[300px] mx-5 my-0 max-lg:mx-0 max-lg:my-5 max-lg:w-full shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                      <canvas 
                        ref={el => chartRefs.current[team] = el}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={restartGame} className="mt-10 mx-auto py-3 px-6 text-[1.1rem] text-white bg-[#CB0E38] border-none rounded-lg cursor-pointer transition-all duration-300 block hover:bg-[#a30b2d] hover:-translate-y-0.5">
        Restart Simulation
      </button>
    </div>
  );
};

export default ResultsScreen;
