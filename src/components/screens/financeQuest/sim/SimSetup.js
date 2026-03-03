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
    return <div className="GroupCreation-loading">Loading...</div>;
  }

  return (
    <div className="GroupCreation-dashboard">
      <header className="GroupCreation-header">
        <button 
          onClick={() => navigate('/select')} 
          className="GroupCreation-logo-button"
        >
          <img src={LifeSmartLogo} alt="LifeSmart Logo" className="GroupCreation-logo" />
        </button>
        <div className="GroupCreation-header-icons">
          <button onClick={() => setShowSimulationControls(!showSimulationControls)} className="GroupCreation-simulation-controls-toggle">
            <FaCog />
          </button>
          <button onClick={() => setShowSimulationHistory(!showSimulationHistory)} className="GroupCreation-simulation-history-toggle">
            <FaCalendarAlt />
          </button>
        </div>
      </header>

      {showSimulationControls && <SimulationControls />}
      {showSimulationHistory && <SimulationHistory onViewSimulationDetails={setCurrentSimulationIndex} />}

      <main>
        {!currentSimulationIndex && (
          <>
            <div className="GroupCreation-settings">
              <div className="GroupCreation-settings-group">
                <label htmlFor="max-value-input">Max Portfolio Value:</label>
                <input
                  id="max-value-input"
                  type="number"
                  value={maxPortfolioValue}
                  onChange={(e) => setMaxPortfolioValue(Number(e.target.value))}
                  className="GroupCreation-modern-input"
                  step="5000"
                />
                <label htmlFor="round-to-input">Round Up To:</label>
                <input
                  id="round-to-input"
                  type="number"
                  value={roundTo}
                  onChange={(e) => setRoundTo(Number(e.target.value))}
                  className="GroupCreation-modern-input"
                  step="1000"
                />
              </div>
              <div className="GroupCreation-settings-group">
                <label className="GroupCreation-toggle-label">
                  <input
                    type="checkbox"
                    checked={enableRandomGeneration}
                    onChange={(e) => setEnableRandomGeneration(e.target.checked)}
                    className="GroupCreation-toggle-input"
                  />
                  <span className="GroupCreation-toggle-text">Enable Random Generation</span>
                </label>
              </div>
            </div>

            <h1 className="GroupCreation-header-content">
              <FaChartLine className="GroupCreation-blueline" />
              <span>Group Management</span>
            </h1>

            <div className="GroupCreation-allocation-image">
              <FaChartPie size={100} />
            </div>

            <div className="GroupCreation-groups">
              {groups.map((group, index) => (
                <div key={index} className="GroupCreation-group">
                  <div className="GroupCreation-group-header">
                    <h2>
                      {group.name}
                      <span className="GroupCreation-group-points">({group.points} points)</span>
                    </h2>
                    <div className="GroupCreation-group-actions">
                      <button 
                        onClick={() => generateRandomValues(index)} 
                        className="GroupCreation-random-btn"
                        title="Generate Random Values"
                        disabled={!enableRandomGeneration}
                      >
                        <FaDice />
                      </button>
                      <button onClick={() => editGroupName(index)} className="GroupCreation-edit-group-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => removeGroup(index)} className="GroupCreation-remove-group-btn">
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                  <div className="GroupCreation-group-content">
                    <div className="GroupCreation-inputs">
                      {Object.entries(group.assets).map(([key, value]) => (
                        <div key={key} className="GroupCreation-input-row">
                          <label htmlFor={`${key}-${index}`}>{key.charAt(0).toUpperCase() + key.slice(1)} (%):</label>
                          <input
                            type="number"
                            value={group.percentages[key]}
                            onChange={(e) => handleAssetInputChange(index, key, e.target.value)}
                            id={`${key}-${index}`}
                            className="GroupCreation-modern-input"
                            min="0"
                            max="100"
                            step="1"
                          />
                          <span className="GroupCreation-amount-display">
                            (£{(value || 0).toLocaleString()})
                          </span>
                        </div>
                      ))}
                      <div className="GroupCreation-total-value">
                        Total Spendable: £{getTotalSpendableAmount(group.points).toLocaleString()}
                        <br />
                        Remaining: £{getRemainingSpendableAmount(group).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addGroup} className="GroupCreation-add-group-btn">
                <FaPlus /> Add Group
              </button>
            </div>

            <button 
              className="GroupCreation-modern-button"
              onClick={startSimulation}
            >
              Start Simulation
              <FaArrowRight style={{ marginLeft: '5px' }} />
            </button>
          </>
        )}
      </main>

      {showModal && (
        <div className="GroupCreation-modal">
          <div className="GroupCreation-modal-content">
            <span className="GroupCreation-close" onClick={() => setShowModal(false)}>&times;</span>
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
              />
              <button onClick={confirmAddGroup}>Confirm</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimSetup; 