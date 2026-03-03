import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db, auth } from '../../../../firebase/initFirebase';
import lifesmartlogo from '../../../../assets/icons/LifeSmartLogo.png';

// Custom hook for chart management
const useChart = (groups, simulationYears, fixedColors) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const destroyChart = useCallback(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
  }, []);

  const calculateYAxisScale = useCallback((data) => {
    // Find the minimum and maximum values across all groups
    const allValues = data.flatMap(group => group.totalPortfolioValues.quarters);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Add padding to the scale (10% of the range)
    const range = maxValue - minValue;
    const padding = range * 0.1;

    return {
      min: Math.max(0, minValue - padding),
      max: maxValue + padding
    };
  }, []);

  const initializeChart = useCallback(() => {
    destroyChart();

    const canvasElement = document.getElementById('portfolioChart');
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const labels = ['Initial Value', ...Array.from({ length: simulationYears * 4 }, (_, i) => `Q${i + 1}`)];
    
    const datasets = groups.map((group, index) => ({
      label: group.name,
      data: [...group.totalPortfolioValues.quarters],
      borderColor: fixedColors[index % fixedColors.length],
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      borderDash: index > 5 ? [5, 5] : []
    }));

    const yAxisScale = calculateYAxisScale(groups);

    const chartConfig = {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 18, weight: 'bold' },
              color: '#333',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20
            },
          },
          title: {
            display: true,
            text: 'Total Portfolio Value Over Time',
          },
          tooltip: {
            enabled: true,
            titleFont: { size: 18 },
            bodyFont: { size: 16 },
            footerFont: { size: 14 },
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: £${context.parsed.y.toLocaleString()}`;
              }
            }
          },
        },
        scales: {
          x: { 
            grid: { display: false },
            ticks: {
              font: { size: 14 }
            }
          },
          y: {
            min: yAxisScale.min,
            max: yAxisScale.max,
            ticks: {
              callback: function(value) {
                return '£' + value.toLocaleString();
              },
              font: { size: 14 }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            }
          }
        },
        maintainAspectRatio: true,
        animation: false,
        transitions: {
          active: {
            animation: {
              duration: 750
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          },
          point: {
            radius: 6,
            hoverRadius: 8,
            backgroundColor: 'white',
            borderWidth: 2
          }
        }
      },
    };

    chartInstanceRef.current = new Chart(ctx, chartConfig);

    chartInstanceRef.current.options.animation = {
      duration: 750,
      easing: 'linear'
    };
  }, [groups, simulationYears, fixedColors, destroyChart, calculateYAxisScale]);

  const updateChart = useCallback(() => {
    if (!chartInstanceRef.current) return;

    const labels = ['Initial Value', ...Array.from({ length: simulationYears * 4 }, (_, i) => `Q${i + 1}`)];
    
    const datasets = groups.map((group, index) => ({
      label: group.name,
      data: [...group.totalPortfolioValues.quarters],
      borderColor: fixedColors[index % fixedColors.length],
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      borderDash: index > 5 ? [5, 5] : []
    }));

    const yAxisScale = calculateYAxisScale(groups);

    chartInstanceRef.current.data.labels = labels;
    chartInstanceRef.current.data.datasets = datasets;
    chartInstanceRef.current.options.scales.y.min = yAxisScale.min;
    chartInstanceRef.current.options.scales.y.max = yAxisScale.max;
    
    chartInstanceRef.current.update('active');
  }, [groups, simulationYears, fixedColors, calculateYAxisScale]);

  useEffect(() => {
    initializeChart();
    return () => {
      destroyChart();
    };
  }, [initializeChart, destroyChart]);

  return { updateChart, chartRef };
};

// Custom hook for simulation state
const useSimulation = (groups, assetChanges, simulationYears, setGroups, simulationSpeed) => {
  const [currentQuarterIndex, setCurrentQuarterIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [allQuarters, setAllQuarters] = useState([]);
  const simulationRef = useRef(null);
  const pausedRef = useRef(false);
  const calculatedQuartersRef = useRef([]);
  const currentQuarterIndexRef = useRef(0);
  const simulationIntervalRef = useRef(null);

  useEffect(() => {
    currentQuarterIndexRef.current = currentQuarterIndex;
  }, [currentQuarterIndex]);

  const calculateAllQuarters = useCallback(() => {
    const totalQuarters = simulationYears * 4;
    const quarters = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
    const calculatedQuarters = [];

    // Initialize with current values
    calculatedQuarters.push(groups);

    // Calculate all quarters upfront
    for (let quarterIndex = 0; quarterIndex < totalQuarters; quarterIndex++) {
      const year = Math.floor(quarterIndex / 4);
      const quarter = quarterIndex % 4;
      const currentQuarter = quarters[quarter];
      const assetChangesForQuarter = assetChanges[year]?.[currentQuarter];

      if (!assetChangesForQuarter) continue;

      const updatedGroups = calculatedQuarters[quarterIndex].map(group => {
        let totalValue = 0;
        const newQuarterlyValues = {
          equity: [...group.quarterlyValues.equity],
          bonds: [...group.quarterlyValues.bonds],
          realestate: [...group.quarterlyValues.realestate],
          commodities: [...group.quarterlyValues.commodities],
          other: [...group.quarterlyValues.other]
        };

        // Calculate new values for each asset type
        Object.keys(assetChangesForQuarter).forEach(assetType => {
          const growthRate = assetChangesForQuarter[assetType] / 100;
          const assetKey = assetType.toLowerCase();
          const currentValue = newQuarterlyValues[assetKey][quarterIndex];
          const newValue = currentValue * (1 + growthRate);
          newQuarterlyValues[assetKey] = [...newQuarterlyValues[assetKey].slice(0, quarterIndex + 1), newValue];
          totalValue += newValue;
        });

        return {
          ...group,
          quarterlyValues: newQuarterlyValues,
          totalPortfolioValues: {
            ...group.totalPortfolioValues,
            quarters: [...group.totalPortfolioValues.quarters.slice(0, quarterIndex + 1), totalValue]
          }
        };
      });

      calculatedQuarters.push(updatedGroups);
    }

    calculatedQuartersRef.current = calculatedQuarters;
    setAllQuarters(calculatedQuarters);
  }, [groups, assetChanges, simulationYears]);

  useEffect(() => {
    calculateAllQuarters();
    return () => {
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }
    };
  }, [calculateAllQuarters]);

  const nextQuarter = useCallback(() => {
    const nextIndex = currentQuarterIndex + 1;
    console.log('[nextQuarter] currentQuarterIndex:', currentQuarterIndex, 'nextIndex:', nextIndex, 'max:', calculatedQuartersRef.current.length - 1);
    if (nextIndex >= calculatedQuartersRef.current.length) {
      console.log('[nextQuarter] Reached end, setting isSimulating to false');
      setIsSimulating(false);
      return;
    }
    setCurrentQuarterIndex(nextIndex);
    setGroups(calculatedQuartersRef.current[nextIndex]);
    console.log('[nextQuarter] Updated to nextIndex:', nextIndex);
  }, [currentQuarterIndex, setGroups]);

  const runFullSimulation = useCallback(() => {
    if (isSimulating) {
      console.log('[runFullSimulation] Already simulating, aborting');
      return;
    }

    console.log('[runFullSimulation] Starting full simulation');
    pausedRef.current = false;
    setIsSimulating(true);

    simulationIntervalRef.current = setInterval(() => {
      const nextIndex = currentQuarterIndexRef.current + 1;
      console.log('[interval] currentQuarterIndexRef:', currentQuarterIndexRef.current, 'nextIndex:', nextIndex, 'max:', calculatedQuartersRef.current.length - 1);

      if (pausedRef.current || nextIndex >= calculatedQuartersRef.current.length) {
        console.log('[interval] Stopping interval. pausedRef:', pausedRef.current, 'nextIndex:', nextIndex);
        clearInterval(simulationIntervalRef.current);
        setIsSimulating(false);
        return;
      }

      setCurrentQuarterIndex(nextIndex);
      setGroups(calculatedQuartersRef.current[nextIndex]);
      currentQuarterIndexRef.current = nextIndex;
      console.log('[interval] Updated to nextIndex:', nextIndex);
    }, simulationSpeed);
  }, [isSimulating, simulationSpeed, setGroups]);

  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        console.log('[useEffect cleanup] Clearing simulationIntervalRef');
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  const pauseSimulation = useCallback(() => {
    pausedRef.current = true;
    setIsSimulating(false);
    if (simulationRef.current) {
      clearTimeout(simulationRef.current);
      simulationRef.current = null;
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  }, []);

  return {
    currentQuarterIndex,
    isSimulating,
    nextQuarter,
    setIsSimulating: pauseSimulation,
    runFullSimulation
  };
};

const Simulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestSimulationIndex, setLatestSimulationIndex] = useState(null);
  const [groups, setGroups] = useState([]);
  const [simulationYears, setSimulationYears] = useState(1);
  const [assetChanges, setAssetChanges] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(750);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);

  const fixedColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8B0000', '#00FF7F', '#FFD700', '#4682B4'
  ];

  const { updateChart, chartRef } = useChart(groups, simulationYears, fixedColors);
  const {
    currentQuarterIndex,
    isSimulating,
    nextQuarter,
    setIsSimulating,
    runFullSimulation
  } = useSimulation(groups, assetChanges, simulationYears, setGroups, simulationSpeed);

  const handleIconSelect = (icon) => {
    if (selectedGroupIndex === null) return;
    
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      newGroups[selectedGroupIndex] = {
        ...newGroups[selectedGroupIndex],
        icon: icon
      };
      return newGroups;
    });
    
    setShowIconSelector(false);
    setSelectedGroupIndex(null);
  };

  const fetchLatestSimulationIndex = async (userId) => {
    try {
      const db = getFirestore();
      const simulationsRef = collection(db, userId, "Asset Market Simulations", "Simulations");
      const querySnapshot = await getDocs(simulationsRef);
      return querySnapshot.empty ? 1 : querySnapshot.size;
    } catch (error) {
      console.error("Error fetching simulation index:", error);
      setError("Failed to fetch simulation data. Please check your internet connection.");
      return 1;
    }
  };

  const fetchAssetChanges = async (userId, index) => {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${index}`, 'Simulation Controls', 'Controls');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAssetChanges(data.assetChanges);
        setSimulationYears(data.years || 1);
      }
    } catch (error) {
      console.error("Error fetching asset changes:", error);
      setError("Failed to fetch simulation data. Please check your internet connection.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    setIsLoading(true);
    setError(null);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUid(user.uid);
          
          if (location.state) {
            const { groups: passedGroups } = location.state;
            const transformedGroups = passedGroups.map(group => ({
              id: group.name,
              name: group.name,
              initialValues: {
                equity: parseFloat(group.equity) || 0,
                bonds: parseFloat(group.bonds) || 0,
                realestate: parseFloat(group.realestate) || 0,
                commodities: parseFloat(group.commodities) || 0,
                other: parseFloat(group.other) || 0
              },
              quarterlyValues: {
                equity: [parseFloat(group.equity) || 0],
                bonds: [parseFloat(group.bonds) || 0],
                realestate: [parseFloat(group.realestate) || 0],
                commodities: [parseFloat(group.commodities) || 0],
                other: [parseFloat(group.other) || 0]
              },
              totalPortfolioValues: {
                initial: Object.values({
                  equity: parseFloat(group.equity) || 0,
                  bonds: parseFloat(group.bonds) || 0,
                  realestate: parseFloat(group.realestate) || 0,
                  commodities: parseFloat(group.commodities) || 0,
                  other: parseFloat(group.other) || 0
                }).reduce((acc, val) => acc + val, 0),
                quarters: [Object.values({
                  equity: parseFloat(group.equity) || 0,
                  bonds: parseFloat(group.bonds) || 0,
                  realestate: parseFloat(group.realestate) || 0,
                  commodities: parseFloat(group.commodities) || 0,
                  other: parseFloat(group.other) || 0
                }).reduce((acc, val) => acc + val, 0)]
              }
            }));
            
            setGroups(transformedGroups);
          }

          const index = await fetchLatestSimulationIndex(user.uid);
          setLatestSimulationIndex(index);
          if (index) {
            await fetchAssetChanges(user.uid, index);
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setError("Failed to initialize simulation. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, location.state]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-[#003F91] text-xl">
        <div className="w-12 h-12 border-4 border-[#003F91] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4">Loading simulation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-[#1a1a1a] text-white">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="bg-gradient-to-br from-[#082148] to-[#0a015a] text-white border-none py-3 px-6 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-px">
          Retry
        </button>
      </div>
    );
  }

  const finishSimulation = async () => {
    try {
      const finalValues = groups.map(group => ({
        name: group.name,
        equity: group.quarterlyValues.equity[group.quarterlyValues.equity.length - 1],
        bonds: group.quarterlyValues.bonds[group.quarterlyValues.bonds.length - 1],
        realestate: group.quarterlyValues.realestate[group.quarterlyValues.realestate.length - 1],
        commodities: group.quarterlyValues.commodities[group.quarterlyValues.commodities.length - 1],
        other: group.quarterlyValues.other[group.quarterlyValues.other.length - 1],
      }));

      const quarterResults = groups.map(group => ({
        name: group.name,
        equity: group.quarterlyValues.equity,
        bonds: group.quarterlyValues.bonds,
        realestate: group.quarterlyValues.realestate,
        commodities: group.quarterlyValues.commodities,
        other: group.quarterlyValues.other,
      }));

      const db = getFirestore();
      await setDoc(doc(db, uid, 'Asset Market Simulations', 'Simulations', 'Simulation 1', "Results", "Final"), { finalValues });
      await setDoc(doc(db, uid, 'Asset Market Simulations', 'Simulations', 'Simulation 1', "Results", "Quarters"), { quarterResults });
      
      // Pass the data directly to the results screen
      navigate('/adult-simulation-results', {
        state: {
          teams: groups.map(g => g.name),
          teamData: finalValues.reduce((acc, val) => {
            acc[val.name] = {
              savings: 0, // Add if you have this data
              investments: [{
                currentValue: val.equity + val.bonds + val.realestate + val.commodities + val.other
              }],
              debt: 0, // Add if you have this data
              equity: val.equity,
              bonds: val.bonds,
              realestate: val.realestate,
              commodities: val.commodities,
              other: val.other
            };
            return acc;
          }, {}),
          quarterResults: quarterResults,
          quizScores: {} // Add if you have quiz scores
        }
      });
    } catch (error) {
      console.error("Error saving simulation results:", error);
      setError("Failed to save simulation results. Please check your internet connection.");
    }
  };

  return (
    <div>
      <header className="bg-[#003F91] text-white py-5 text-center">
        <img src={lifesmartlogo} alt="Logo" className="h-auto w-auto max-w-[200px]" />
      </header>

      <div className="flex flex-col items-center gap-5 p-5 bg-white rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] my-5 mx-auto max-w-[1200px] w-[90%]">
        <canvas id="portfolioChart" ref={chartRef} className="w-full h-[400px] mb-5 max-md:h-[300px]"></canvas>
        
        <button 
          onClick={nextQuarter} 
          className="bg-gradient-to-br from-[#082148] to-[#0a015a] text-white border-none py-3 px-6 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] min-w-[200px] max-md:min-w-[150px] max-md:text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-px"
          disabled={currentQuarterIndex >= simulationYears * 4 || isSimulating}
        >
          Next Quarter
        </button>
        <button 
          onClick={runFullSimulation} 
          className="bg-gradient-to-br from-[#082148] to-[#0a015a] text-white border-none py-3 px-6 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] min-w-[200px] max-md:min-w-[150px] max-md:text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-px"
          disabled={isSimulating || currentQuarterIndex >= simulationYears * 4}
        >
          Run Full Simulation
        </button>
        {isSimulating ? (
          <button 
            onClick={setIsSimulating} 
            className="bg-gradient-to-br from-[#082148] to-[#0a015a] text-white border-none py-3 px-6 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] min-w-[200px] max-md:min-w-[150px] max-md:text-sm hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-px"
          >
            Pause Simulation
          </button>
        ) : currentQuarterIndex > 0 && currentQuarterIndex < simulationYears * 4 ? (
          <button 
            onClick={runFullSimulation} 
            className="bg-gradient-to-br from-[#082148] to-[#0a015a] text-white border-none py-3 px-6 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] min-w-[200px] max-md:min-w-[150px] max-md:text-sm hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-px"
          >
            Resume Simulation
          </button>
        ) : null}
        <input 
          type="number" 
          value={simulationSpeed} 
          onChange={(e) => setSimulationSpeed(Number(e.target.value))}
          min="100" 
          step="100" 
          title="Simulation Speed (ms)"
          className="py-2 px-3 border-2 border-gray-200 rounded-md text-sm w-[100px] text-center transition-all duration-300 focus:border-[#082148] focus:outline-none focus:shadow-[0_0_0_3px_rgba(8,33,72,0.1)]"
        />
      </div>

      <button onClick={finishSimulation} className="bg-gradient-to-br from-[#082148] to-[#0a015a] text-white border-none py-3 px-6 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] min-w-[200px] max-md:min-w-[150px] max-md:text-sm hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-px">
        Finish Simulation
      </button>
    </div>
  );
};

export default Simulation;
