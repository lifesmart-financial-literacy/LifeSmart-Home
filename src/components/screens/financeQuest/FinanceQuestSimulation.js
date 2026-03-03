import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart } from 'chart.js/auto';
import QuestionHeader from './questions/QuestionHeader';
import FinanceQuestResultsScreen from './FinanceQuestResultsScreen';

// Each year: { label, changes: { A: multiplier, B: multiplier, ... }, flat: { A: amount, ... } }
export const DEFAULT_FINANCE_QUEST_YEARS = [
  { label: 'Year 1', changes: { C: 2, D: 2 } },
  { label: 'Year 2', changes: { B: 3, C: 2, D: 2 } },
  { label: 'Year 3', changes: { D: 2, E: 2 }, flat: { A: -50, B: -50, C: -50, D: -50, E: -50 } },
  { label: 'Year 4', changes: { C: 0.5, A: 2, B: 0.5, E: 3 } },
  { label: 'Year 5', changes: { A: 2, C: 2 } },
  { label: 'Year 6', changes: { A: 0.5, B: 0.5, C: 0.5, E: 2, D: 2 } },
  { label: 'Year 7', changes: { A: 3, C: 2, B: 3 } },
];

const potLetters = ['A', 'B', 'C', 'D', 'E'];
const potNames = {
  A: 'Training & Self-Development',
  B: 'Life-Experiences & Fun',
  C: 'Investment',
  D: 'Health & Well-being',
  E: 'Emergency',
};

function simulateAllYears(teams, initialAllocations, baseFunds, yearsConfig) {
  // Returns: [{ name, yearly: [ {A, B, C, D, E, total}, ... ] }]
  return teams.map((team, idx) => {
    const teamBase = baseFunds + (team.points || 0) * 1000;
    const alloc = initialAllocations[idx];
    // Year 0: initial allocation
    let yearArr = [];
    let total = 0;
    let pots = {};
    potLetters.forEach(l => {
      pots[l] = (parseInt(alloc[l]) || 0) / 100 * teamBase;
      total += pots[l];
    });
    yearArr.push({ ...pots, total });
    // Years 1-7
    for (let y = 0; y < yearsConfig.length; y++) {
      const { changes = {}, flat = {} } = yearsConfig[y];
      let newPots = {};
      let newTotal = 0;
      potLetters.forEach(l => {
        let val = yearArr[y][l];
        if (changes[l]) val *= changes[l];
        if (flat[l]) val += flat[l];
        // Prevent negative values
        val = Math.max(0, val);
        newPots[l] = val;
        newTotal += val;
      });
      yearArr.push({ ...newPots, total: newTotal });
    }
    return { name: team.name, yearly: yearArr };
  });
}

const teamColors = [
  '#FFD43B', '#CA70E3', '#4DD7FF', '#FF9524', '#E1551D', '#36A2EB', '#FF6384', '#4BC0C0', '#9966FF', '#FF9F40'
];

const potColors = {
  A: '#4DD7FF',
  B: '#FF9524',
  C: '#FFD43B',
  D: '#CA70E3',
  E: '#E1551D',
};

const FinanceQuestSimulation = ({ teams, initialAllocations, baseFunds }) => {
  const [year, setYear] = useState(0); // 0 = initial, 1 = after year 1, ...
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [yearsConfig, setYearsConfig] = useState(DEFAULT_FINANCE_QUEST_YEARS);
  const [editYears, setEditYears] = useState(JSON.parse(JSON.stringify(DEFAULT_FINANCE_QUEST_YEARS)));
  const [restartKey, setRestartKey] = useState(0);

  const results = simulateAllYears(teams, initialAllocations, baseFunds, yearsConfig);
  const maxYear = yearsConfig.length;
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const runTimeout = useRef(null);

  // Always show all years on the x-axis - memoized to avoid effect re-runs
  const allLabels = useMemo(() => ['Initial', ...yearsConfig.map(y => y.label)], [yearsConfig]);

  useEffect(() => {
    // Prepare data for the chart
    const datasets = results.map((team, idx) => {
      // Only show data up to the current year, rest as null
      const data = team.yearly.map((y, i) => (i <= year ? y.total : null));
      return {
        label: team.name,
        data,
        borderColor: teamColors[idx % teamColors.length],
        backgroundColor: teamColors[idx % teamColors.length],
        fill: false,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      };
    });
    // Destroy previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    if (chartRef.current) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: { labels: allLabels, datasets },
        options: {
          responsive: true,
          animation: false,
          transitions: { active: { animation: false } },
          plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: 'Team Total Value Over Years' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: £${Math.round(context.parsed.y).toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) { return '£' + value.toLocaleString(); }
              }
            }
          }
        }
      });
    }
    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- allLabels derived from yearsConfig
  }, [results, year, restartKey, allLabels]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (runTimeout.current) clearTimeout(runTimeout.current);
    };
  }, []);

  const runSimulation = () => {
    setIsRunning(true);
    const step = (current) => {
      if (current > maxYear) {
        setIsRunning(false);
        return;
      }
      setYear(current);
      runTimeout.current = setTimeout(() => step(current + 1), 700);
    };
    step(1);
  };

  const handleDevEditChange = (yearIdx, type, pot, value) => {
    setEditYears(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (type === 'changes') {
        updated[yearIdx].changes[pot] = value === '' ? '' : parseFloat(value);
      } else if (type === 'flat') {
        updated[yearIdx].flat = updated[yearIdx].flat || {};
        updated[yearIdx].flat[pot] = value === '' ? '' : parseFloat(value);
      }
      return updated;
    });
  };

  const handleApplyDevControls = () => {
    // Remove empty strings and convert to numbers
    const cleaned = editYears.map(y => ({
      label: y.label,
      changes: Object.fromEntries(Object.entries(y.changes || {}).filter(([_, v]) => v !== '' && !isNaN(v)).map(([k, v]) => [k, parseFloat(v)])),
      flat: y.flat ? Object.fromEntries(Object.entries(y.flat).filter(([_, v]) => v !== '' && !isNaN(v)).map(([k, v]) => [k, parseFloat(v)])) : undefined,
    }));
    setYearsConfig(cleaned);
    setYear(0);
    setRestartKey(k => k + 1);
  };

  const handleResetDevControls = () => {
    setEditYears(JSON.parse(JSON.stringify(DEFAULT_FINANCE_QUEST_YEARS)));
  };

  const handleRestartSimulation = () => {
    setShowResults(false);
    setYear(0);
    setIsRunning(false);
    setRestartKey(k => k + 1);
  };

  if (showResults) {
    return <FinanceQuestResultsScreen results={results} onRestart={handleRestartSimulation} />;
  }

  return (
    <>
    <QuestionHeader />
    <div className="fq-sim-root-bg w-full min-h-screen text-[#FFD43B] font-['Press_Start_2P',monospace] pt-10 text-center">
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: 1100, margin: '0 auto' }}>
        <button
          className="font-['Press_Start_2P',monospace] text-[1.01rem] rounded-lg border-[2.5px] border-[#CA70E3] bg-[#1C0032] text-[#FFD43B] py-2.5 px-[22px] mx-0.5 cursor-pointer shadow-[0_2px_0_#CA70E344] transition-all duration-150 hover:bg-[#FFD43B] hover:text-[#1C0032] hover:border-[#FFD43B] hover:scale-[1.04] active:bg-[#CA70E3] active:text-[#FFD43B] active:border-[#CA70E3] active:scale-[0.98] disabled:bg-[#333] disabled:text-[#888] disabled:border-[#555] disabled:cursor-not-allowed disabled:shadow-none"
          style={{ marginBottom: 12, fontSize: '0.95rem', padding: '7px 18px' }}
          onClick={() => setDevMode(d => !d)}
        >
          {devMode ? 'Disable DEV Mode' : 'Enable DEV Mode'}
        </button>
      </div>
      {devMode && (
        <div className="bg-[#1C0032] border-2 border-[#FFD43B] rounded-xl p-[18px] mb-[18px] max-w-[1100px] mx-auto" style={{ marginBottom: 18 }}>
          <h3 className="text-[#FFD43B] font-['Press_Start_2P'] text-[1.1rem] mb-3">DEV: Edit Simulation Controls</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[#FFD43B] font-['Montserrat',Arial,sans-serif] text-[1.01rem] border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#FFD43B] p-1">Year</th>
                  {potLetters.map(l => <th key={l + 'm'} className="border-b-2 border-[#FFD43B] p-1">{potNames[l]}<br/>x</th>)}
                  {potLetters.map(l => <th key={l + 'f'} className="border-b-2 border-[#FFD43B] p-1">{potNames[l]}<br/>+/-</th>)}
                </tr>
              </thead>
              <tbody>
                {editYears.map((y, yIdx) => (
                  <tr key={yIdx}>
                    <td className="font-bold p-1">{y.label}</td>
                    {potLetters.map(l => (
                      <td key={l + 'm'} className="p-0.5">
                        <input
                          type="number"
                          step="0.01"
                          value={y.changes[l] ?? ''}
                          onChange={e => handleDevEditChange(yIdx, 'changes', l, e.target.value)}
                          className="w-[60px] text-base rounded border-[1.5px] border-[#FFD43B] bg-[#2D0245] text-[#FFD43B] text-center"
                        />
                      </td>
                    ))}
                    {potLetters.map(l => (
                      <td key={l + 'f'} className="p-0.5">
                        <input
                          type="number"
                          step="1"
                          value={y.flat && y.flat[l] !== undefined ? y.flat[l] : ''}
                          onChange={e => handleDevEditChange(yIdx, 'flat', l, e.target.value)}
                          className="w-[60px] text-base rounded border-[1.5px] border-[#FFD43B] bg-[#2D0245] text-[#FFD43B] text-center"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-3">
            <button className="font-['Press_Start_2P',monospace] text-[1.01rem] rounded-lg border-[2.5px] border-[#CA70E3] bg-[#1C0032] text-[#FFD43B] py-2.5 px-[22px] cursor-pointer shadow-[0_2px_0_#CA70E344] transition-all duration-150 hover:bg-[#FFD43B] hover:text-[#1C0032] hover:border-[#FFD43B] hover:scale-[1.04] active:bg-[#CA70E3] active:text-[#FFD43B] active:border-[#CA70E3] active:scale-[0.98]" onClick={handleApplyDevControls}>Apply & Restart Simulation</button>
            <button className="font-['Press_Start_2P',monospace] text-[1.01rem] rounded-lg border-[2.5px] border-[#CA70E3] bg-[#1C0032] text-[#FFD43B] py-2.5 px-[22px] cursor-pointer shadow-[0_2px_0_#CA70E344] transition-all duration-150 hover:bg-[#FFD43B] hover:text-[#1C0032] hover:border-[#FFD43B] hover:scale-[1.04] active:bg-[#CA70E3] active:text-[#FFD43B] active:border-[#CA70E3] active:scale-[0.98]" onClick={handleResetDevControls}>Reset to Default</button>
          </div>
        </div>
      )}
      <h2>Finance Quest Simulation</h2>
      <div className="flex justify-center items-center gap-[18px] mx-auto mb-[18px] py-[18px] px-6 bg-[rgba(28,0,50,0.85)] rounded-2xl shadow-[0_2px_0_#FFD43B44] max-w-[600px]">
        <button className="font-['Press_Start_2P',monospace] text-[1.01rem] rounded-lg border-[2.5px] border-[#CA70E3] bg-[#1C0032] text-[#FFD43B] py-2.5 px-[22px] mx-0.5 cursor-pointer shadow-[0_2px_0_#CA70E344] transition-all duration-150 hover:bg-[#FFD43B] hover:text-[#1C0032] hover:border-[#FFD43B] hover:scale-[1.04] active:bg-[#CA70E3] active:text-[#FFD43B] active:border-[#CA70E3] active:scale-[0.98] disabled:bg-[#333] disabled:text-[#888] disabled:border-[#555] disabled:cursor-not-allowed disabled:shadow-none" onClick={() => setYear(y => Math.max(0, y - 1))} disabled={year === 0 || isRunning}>Previous</button>
        <span className="font-['Press_Start_2P',monospace] text-[1.18rem] text-[#FFD43B] font-bold tracking-[1px] mx-2 min-w-[120px] text-center">
          {year === 0 ? 'Initial Allocation' : yearsConfig[year - 1]?.label}
        </span>
        <button className="font-['Press_Start_2P',monospace] text-[1.01rem] rounded-lg border-[2.5px] border-[#CA70E3] bg-[#1C0032] text-[#FFD43B] py-2.5 px-[22px] mx-0.5 cursor-pointer shadow-[0_2px_0_#CA70E344] transition-all duration-150 hover:bg-[#FFD43B] hover:text-[#1C0032] hover:border-[#FFD43B] hover:scale-[1.04] active:bg-[#CA70E3] active:text-[#FFD43B] active:border-[#CA70E3] active:scale-[0.98] disabled:bg-[#333] disabled:text-[#888] disabled:border-[#555] disabled:cursor-not-allowed disabled:shadow-none" onClick={() => setYear(y => Math.min(maxYear, y + 1))} disabled={year === maxYear || isRunning}>Next</button>
        <button className="bg-[#FFD43B] text-[#1C0032] border-[2.5px] border-[#CA70E3] font-bold ml-[18px] rounded-lg py-2.5 px-[22px] shadow-[0_2px_0_#FFD43B44] transition-all duration-150 hover:bg-[#CA70E3] hover:text-[#FFD43B] hover:border-[#FFD43B] hover:scale-[1.04] active:bg-[#FF9524] active:text-white active:border-[#FF9524] active:scale-[0.98] disabled:bg-[#ccc] disabled:text-[#888] disabled:border-[#aaa] disabled:cursor-not-allowed disabled:shadow-none font-['Press_Start_2P',monospace]" onClick={runSimulation} disabled={isRunning || year === maxYear}>
          {isRunning ? 'Running...' : 'Run Simulation'}
        </button>
        {year === maxYear && !isRunning && (
          <button className="bg-[#FFD43B] text-[#1C0032] border-[2.5px] border-[#CA70E3] font-bold rounded-lg py-2.5 px-[22px] shadow-[0_2px_0_#FFD43B44] transition-all duration-150 hover:bg-[#CA70E3] hover:text-[#FFD43B] hover:border-[#FFD43B] hover:scale-[1.04] active:bg-[#FF9524] active:text-white active:border-[#FF9524] active:scale-[0.98] font-['Press_Start_2P',monospace]" style={{ marginLeft: 18 }} onClick={() => setShowResults(true)}>
            View Results
          </button>
        )}
      </div>
      <div className="bg-[#1C0032] border-4 border-[#FFD43B] rounded-[18px] shadow-[0_4px_0_#CA70E344,0_0_8px_#FFD43B55] my-8 mx-auto py-8 px-6 max-w-[900px] min-w-[320px] flex flex-col items-center max-[900px]:p-3 max-[900px]:min-w-0 max-[900px]:max-w-[98vw]">
        <canvas id="financeQuestChart" ref={chartRef} height={320}></canvas>
        <div className="flex flex-wrap justify-center gap-[18px] mt-[18px]">
          {results.map((team, idx) => (
            <div key={team.name} className="flex items-center font-['Press_Start_2P',monospace] text-[1.05rem] text-[#FFD43B] mr-[18px]">
              <span className="w-[22px] h-[22px] rounded-md mr-2 border-[2.5px] border-white shadow-[0_2px_0_#0008]" style={{ background: teamColors[idx % teamColors.length] }}></span>
              {team.name}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mx-auto mt-8 max-w-[1100px] px-3 max-[900px]:grid-cols-1 max-[900px]:gap-3 max-[900px]:max-w-[98vw]">
        {results.map((team, idx) => (
          <div key={team.name} className="bg-[#2D0245] border-[3px] border-[#FFD43B] rounded-[14px] shadow-[0_2px_0_#0008] p-[18px] min-w-[180px] max-w-[260px] font-['Montserrat',Arial,sans-serif] text-[#FFD43B] text-center transition-all duration-150 flex flex-col items-center hover:shadow-[0_8px_24px_#FFD43B44] hover:scale-[1.03] hover:border-[#CA70E3] max-[900px]:min-w-[120px] max-[900px]:max-w-[98vw]">
            <div className="font-['Press_Start_2P',monospace] text-[1.12rem] mb-2.5 text-[#FFD43B] tracking-[1px] font-bold border-b-2 border-[#FFD43B44] pb-1.5 w-full">{team.name}</div>
            {potLetters.map(l => (
              <div key={l} className="flex justify-between items-center text-[1.01rem] w-full py-1 border-b border-[#FFD43B22] font-['Montserrat',Arial,sans-serif] last:border-b-0" style={{ marginBottom: 6 }}>
                <span className="font-bold">{potNames[l]}:</span>
                <span className="text-[1.08rem] font-['Montserrat',Arial,sans-serif] font-bold ml-2" style={{ color: potColors[l] }}>
                  £{Math.round(team.yearly[year][l]).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="mt-2.5 font-bold" style={{ color: teamColors[idx % teamColors.length] }}>
              Total: £{Math.round(team.yearly[year].total).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default FinanceQuestSimulation;
