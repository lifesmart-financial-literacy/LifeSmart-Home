import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { 
  FaCog, 
  FaCalendarAlt, 
  FaArrowRight,
  FaPlus,
  FaDice,
  FaChartLine,
  FaChartPie,
  FaEdit,
  FaTimes
} from 'react-icons/fa';
import SimulationControls from './SimulationControls';
import SimulationHistory from './PastSimulations';
import LifeSmartLogo from '../../../../assets/icons/LifeSmartLogo.png';

Chart.register(ArcElement, Tooltip, Legend, Title);

const SimSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showSimulationControls, setShowSimulationControls] = useState(false);
  const [showSimulationHistory, setShowSimulationHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [currentSimulationIndex, setCurrentSimulationIndex] = useState(null);
  const [maxPortfolioValue, setMaxPortfolioValue] = useState(100000);
  const [roundTo, setRoundTo] = useState(5000);
  const [enableRandomGeneration, setEnableRandomGeneration] = useState(true);
  const [groups, setGroups] = useState([]);
  const chartsRef = useRef([]);

  useEffect(() => {
    // Only use navigation state for teams/points
    const teamsFromState = location.state?.teams;
    if (teamsFromState) {
      const teamsData = teamsFromState.map(team => ({
        name: team.name,
        points: team.points,
        assets: {
          equity: 0,
          bonds: 0,
          realestate: 0,
          commodities: 0,
          other: 0,
        },
        percentages: {
          equity: 0,
          bonds: 0,
          realestate: 0,
          commodities: 0,
          other: 0,
        },
        usePercentage: true,
        allocatedFunds: 0,
      }));
      setGroups(teamsData);
    }
    setIsLoading(false);
  }, [location.state]);

  const getTotalSpendableAmount = (points) => {
    return 100000 + (points * 5000);
  };

  const getRemainingSpendableAmount = (group) => {
    const totalSpendable = getTotalSpendableAmount(group.points);
    const totalAllocated = Object.values(group.assets).reduce(
      (sum, value) => sum + parseFloat(value || 0),
      0
    );
    return totalSpendable - totalAllocated;
  };

  const updateSpendableAmount = (index) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const group = newGroups[index];
      const remaining = getRemainingSpendableAmount(group);
      newGroups[index].allocatedFunds = remaining;
      return newGroups;
    });
  };

  const handleAssetInputChange = (index, key, value) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const group = newGroups[index];
      const totalSpendable = getTotalSpendableAmount(group.points);
      if (value === '') {
        group.percentages[key] = '';
        group.assets[key] = 0;
        return newGroups;
      }
      const newPercentage = parseFloat(value);
      if (newPercentage < 0 || newPercentage > 100) {
        alert('Percentage must be between 0 and 100');
        return prevGroups;
      }
      const newAmount = (newPercentage / 100) * totalSpendable;
      const currentTotalPercentage = Object.values(group.percentages).reduce(
        (sum, val) => sum + parseFloat(val || 0),
        0
      );
      const newTotalPercentage = currentTotalPercentage - (parseFloat(group.percentages[key]) || 0) + newPercentage;
      if (newTotalPercentage > 100) {
        alert('Total allocation cannot exceed 100%');
        return prevGroups;
      }
      group.percentages[key] = newPercentage;
      group.assets[key] = newAmount;
      return newGroups;
    });
    updateSpendableAmount(index);
  };

  const generateRandomValues = (index) => {
    if (!enableRandomGeneration) return;
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const group = newGroups[index];
      const totalSpendable = getTotalSpendableAmount(group.points);
      let remainingPercentage = 100;
      const percentages = [];
      for (let i = 0; i < 4; i++) {
        const max = remainingPercentage - (4 - i);
        const percentage = Math.floor(Math.random() * max) + 1;
        percentages.push(percentage);
        remainingPercentage -= percentage;
      }
      percentages.push(remainingPercentage);
      for (let i = percentages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [percentages[i], percentages[j]] = [percentages[j], percentages[i]];
      }
      const assetTypes = ['equity', 'bonds', 'realestate', 'commodities', 'other'];
      assetTypes.forEach((type, i) => {
        group.percentages[type] = percentages[i];
        group.assets[type] = (percentages[i] / 100) * totalSpendable;
      });
      return newGroups;
    });
  };

  const editGroupName = (index) => {
    const newName = prompt("Enter new group name:", groups[index].name);
    if (newName && newName.trim() !== '') {
      setGroups(prevGroups => {
        const newGroups = [...prevGroups];
        newGroups[index].name = newName.trim();
        return newGroups;
      });
    }
  };

  const removeGroup = (index) => {
    setGroups(prevGroups => {
      const newGroups = prevGroups.filter((_, i) => i !== index);
      if (chartsRef.current[index]) {
        chartsRef.current[index].destroy();
        chartsRef.current = chartsRef.current.filter((_, i) => i !== index);
      }
      return newGroups;
    });
  };

  const addGroup = () => {
    setShowModal(true);
  };

  const confirmAddGroup = () => {
    if (newGroupName.trim()) {
      setGroups(prevGroups => [...prevGroups, {
        name: newGroupName.trim(),
        points: 0,
        assets: {
          equity: 0,
          bonds: 0,
          realestate: 0,
          commodities: 0,
          other: 0,
        },
        percentages: {
          equity: 0,
          bonds: 0,
          realestate: 0,
          commodities: 0,
          other: 0,
        },
        usePercentage: true,
        allocatedFunds: 0,
      }]);
      setNewGroupName('');
      setShowModal(false);
    } else {
      alert('Please enter a group name.');
    }
  };

  const startSimulation = async () => {
    const hasEmptyValues = groups.some(group => {
      const totalPercentage = Object.values(group.percentages).reduce(
        (sum, val) => sum + parseFloat(val || 0),
        0
      );
      return totalPercentage === 0;
    });
    if (hasEmptyValues) {
      alert('Please fill in allocation values for each group before starting the simulation.');
      return;
    }
    const formattedGroups = groups.map(group => ({
      name: group.name,
      equity: group.assets.equity.toString(),
      bonds: group.assets.bonds.toString(),
      realestate: group.assets.realestate.toString(),
      commodities: group.assets.commodities.toString(),
      other: group.assets.other.toString(),
      points: group.points || 0,
      equityTemp: group.assets.equity.toString(),
      bondsTemp: group.assets.bonds.toString(),
      realestateTemp: group.assets.realestate.toString(),
      commoditiesTemp: group.assets.commodities.toString(),
      otherTemp: group.assets.other.toString()
    }));
    navigate('/adult-simulation-page', { 
      state: { 
        groups: formattedGroups,
        maxPortfolioValue,
        roundTo
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-10 text-lg text-gray-600">Loading...</div>;
  }

  return (
    <div className="grid min-h-screen fq-fade-in bg-gradient-to-br from-[#f6f2ee] to-[#e9e4e0] font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] m-0 p-0">
      <header className="col-span-full flex justify-between items-center p-4 bg-gradient-to-br from-[#102454] to-[#1a3a7a] rounded-b-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative overflow-hidden h-[200px]">
        <button 
          onClick={() => navigate('/select')} 
          className="bg-none border-none p-0 cursor-pointer transition-transform duration-300 ease-out hover:scale-105"
        >
          <img src={LifeSmartLogo} alt="LifeSmart Logo" className="h-[200px] w-auto block ml-0 [clip-path:polygon(0_0,60%_0,60%_100%,0_100%)]" />
        </button>
        <div className="relative flex justify-end items-center gap-4">
          <button onClick={() => setShowSimulationControls(!showSimulationControls)} className="bg-white/10 border-none rounded-full p-3 m-0 mx-2 cursor-pointer text-white transition-all duration-300 backdrop-blur-[5px] hover:bg-white/20 hover:-translate-y-1 hover:rotate-360 [&_svg]:w-6 [&_svg]:h-6">
            <FaCog />
          </button>
          <button onClick={() => setShowSimulationHistory(!showSimulationHistory)} className="bg-white/10 border-none rounded-full p-3 m-0 mx-2 cursor-pointer text-white transition-all duration-300 backdrop-blur-[5px] hover:bg-white/20 hover:-translate-y-1 hover:rotate-360 [&_svg]:w-6 [&_svg]:h-6">
            <FaCalendarAlt />
          </button>
        </div>
      </header>

      {showSimulationControls && <SimulationControls />}
      {showSimulationHistory && <SimulationHistory onViewSimulationDetails={setCurrentSimulationIndex} />}

      <main>
        {!currentSimulationIndex && (
          <>
            <div className="bg-white/90 backdrop-blur-[10px] p-5 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] my-5 flex items-center justify-between max-md:flex-col max-md:gap-4">
              <div className="flex items-center gap-5">
                <label htmlFor="max-value-input">Max Portfolio Value:</label>
                <input
                  id="max-value-input"
                  type="number"
                  value={maxPortfolioValue}
                  onChange={(e) => setMaxPortfolioValue(Number(e.target.value))}
                  className="bg-white/90 border-2 border-transparent rounded-lg py-2.5 px-4 text-base transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.05)] focus:border-[#082148] focus:shadow-[0_4px_15px_rgba(0,0,0,0.1)] focus:outline-none"
                  step="5000"
                />
                <label htmlFor="round-to-input">Round Up To:</label>
                <input
                  id="round-to-input"
                  type="number"
                  value={roundTo}
                  onChange={(e) => setRoundTo(Number(e.target.value))}
                  className="bg-white/90 border-2 border-transparent rounded-lg py-2.5 px-4 text-base transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.05)] focus:border-[#082148] focus:shadow-[0_4px_15px_rgba(0,0,0,0.1)] focus:outline-none"
                  step="1000"
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableRandomGeneration}
                    onChange={(e) => setEnableRandomGeneration(e.target.checked)}
                    className="relative w-[50px] h-6 appearance-none bg-[#e2e8f0] rounded-xl transition-all duration-300 cursor-pointer checked:bg-[#4CAF50]"
                  />
                  <span className="font-medium text-[#2c3e50]">Enable Random Generation</span>
                </label>
              </div>
            </div>

            <h1 className="flex items-center justify-items-start mt-5 mb-5 text-black">
              <FaChartLine className="h-[50px]" />
              <span className="text-2xl font-bold ml-2">Group Management</span>
            </h1>

            <div className="flex justify-center my-5">
              <FaChartPie size={100} />
            </div>

            <div className="flex flex-wrap justify-center items-center gap-5">
              {groups.map((group, index) => (
                <div key={index} className="mr-5 mb-5 bg-white/90 backdrop-blur-[10px] rounded-[15px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 border border-white/20 fq-fade-in hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
                  <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-black/10">
                    <h2 className="text-[#2c3e50] text-[1.4em] m-0 font-semibold">
                      {group.name}
                      <span className="text-[0.9rem] text-[#888] ml-2.5">({group.points} points)</span>
                    </h2>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => generateRandomValues(index)} 
                        className="bg-white/10 border-none rounded-full p-2 cursor-pointer transition-all duration-300 m-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:bg-[#4CAF50]/10 hover:rotate-360"
                        title="Generate Random Values"
                        disabled={!enableRandomGeneration}
                      >
                        <FaDice className="text-[#4CAF50]" />
                      </button>
                      <button onClick={() => editGroupName(index)} className="bg-white/10 border-none rounded-full p-2 cursor-pointer transition-all duration-300 m-0 hover:bg-[#4CAF50]/10 hover:rotate-15">
                        <FaEdit className="text-[#082148]" />
                      </button>
                      <button onClick={() => removeGroup(index)} className="bg-white/10 border-none rounded-full p-2 cursor-pointer transition-all duration-300 m-0 hover:bg-[#f44336]/10 hover:rotate-15">
                        <FaTimes className="text-[#082148]" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      {Object.entries(group.assets).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between mb-2.5">
                          <label htmlFor={`${key}-${index}`} className="mr-2.5 text-black">{key.charAt(0).toUpperCase() + key.slice(1)} (%):</label>
                          <input
                            type="number"
                            value={group.percentages[key]}
                            onChange={(e) => handleAssetInputChange(index, key, e.target.value)}
                            id={`${key}-${index}`}
                            className="bg-white/90 border-2 border-transparent rounded-lg py-2.5 px-4 text-base transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.05)] focus:border-[#082148] focus:shadow-[0_4px_15px_rgba(0,0,0,0.1)] focus:outline-none text-center"
                            min="0"
                            max="100"
                            step="1"
                          />
                          <span className="text-[#082148]">
                            (£{(value || 0).toLocaleString()})
                          </span>
                        </div>
                      ))}
                      <div className="bg-gradient-to-br from-[#082148] to-[#0a015a] text-white py-4 rounded-lg text-center text-base font-medium my-5 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                        Total Spendable: £{getTotalSpendableAmount(group.points).toLocaleString()}
                        <br />
                        Remaining: £{getRemainingSpendableAmount(group).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addGroup} className="bg-gradient-to-br from-[#4CAF50] to-[#45a049] text-white border-none py-4 px-8 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
                <FaPlus /> Add Group
              </button>
            </div>

            <button 
              className="bg-gradient-to-br from-[#082148] to-[#0a015a] text-white border-none py-3 px-6 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-px"
              onClick={startSimulation}
            >
              Start Simulation
              <FaArrowRight style={{ marginLeft: '5px' }} />
            </button>
          </>
        )}
      </main>

      {showModal && (
        <div className="flex justify-center items-center fixed z-[1000] inset-0 overflow-auto bg-black/50 backdrop-blur-[5px]">
          <div className="bg-white/95 backdrop-blur-[10px] rounded-[15px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] fq-fade-in-fast m-auto p-5 border border-gray-500 w-4/5 max-w-[500px]">
            <span className="text-[#aaaaaa] float-right text-[28px] font-bold cursor-pointer hover:text-black" onClick={() => setShowModal(false)}>&times;</span>
            <h3>Add a new group</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              confirmAddGroup();
            }}>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                required
                autoFocus
                className="w-full py-2.5 my-2.5 border border-gray-300 rounded box-border"
              />
              <button onClick={confirmAddGroup} className="w-full bg-gradient-to-br from-[#001f3f] to-[#000080] text-white py-3 px-6 my-2.5 border-none rounded-lg font-medium cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]">Confirm</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimSetup;
