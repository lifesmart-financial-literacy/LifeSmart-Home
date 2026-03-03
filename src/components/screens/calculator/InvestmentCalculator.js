import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart } from 'chart.js/auto';
import { FaCalculator, FaChartLine, FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InvestmentCalculator = () => {
  const navigate = useNavigate();
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [rate, setRate] = useState(8);
  const [futureValue, setFutureValue] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const calculate = useCallback(() => {
    const principal = parseFloat(initialInvestment);
    const monthlyContributionValue = parseFloat(monthlyContribution);
    const years = parseInt(investmentPeriod);
    const monthlyRate = rate / 100 / 12;
    let currentValue = principal;
    const data = [currentValue];

    for (let i = 1; i <= years * 12; i++) {
      currentValue = currentValue * (1 + monthlyRate) + monthlyContributionValue;
      if (i % 12 === 0) data.push(currentValue);
    }

    setFutureValue(currentValue.toFixed(2));
    renderChart(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- renderChart uses refs, including causes infinite loop
  }, [initialInvestment, monthlyContribution, investmentPeriod, rate]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const formatNumber = (value) => {
    return parseFloat(value).toLocaleString('en-GB');
  };

  const renderChart = (data = []) => {
    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: investmentPeriod + 1 }, (_, i) => 
          i === 0 ? 'Start' : `Year ${i}`
        ),
        datasets: [{
          label: `Growth at ${rate}%`,
          data: data,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': £';
                }
                label += context.parsed.y.toFixed(2);
                return label;
              }
            }
          },
          legend: {
            display: true,
            labels: {
              color: '#4CAF50',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Years',
              color: '#fff',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              display: false,
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value (£)',
              color: '#fff',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff'
            }
          }
        }
      }
    });
  };

  const handleInputChange = (setter) => (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white font-sans">
      <header className="relative overflow-hidden bg-gradient-to-br from-[#1e1e1e] to-[#2d2d2d] text-white py-10 px-5 text-center border-b border-white/10 before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.05)_50%,transparent_55%)] before:animate-slideIn">
        <div className="absolute top-5 left-5 cursor-pointer z-10 transition-transform duration-300 hover:scale-105" onClick={() => navigate('/select')}>
          <h2 className="m-0 text-[1.8rem] font-bold bg-gradient-to-r from-[#4CAF50] to-[#81C784] bg-clip-text text-transparent">LifeSmart</h2>
        </div>
        <div className="relative z-10 max-w-[800px] mx-auto">
          <div className="text-[3rem] mb-5 text-white/90">
            <FaCalculator />
          </div>
          <h1 className="m-0 mb-4 text-[2.5rem] font-bold text-white">Investment Calculator</h1>
          <p className="m-0 text-xl opacity-90 max-w-[600px] mx-auto">Plan your financial future with our advanced investment calculator</p>
        </div>
        <div className="flex justify-center gap-10 mt-8">
          <div className="flex items-center gap-2.5 text-lg opacity-90">
            <FaChartLine className="text-2xl" />
            <span>Real-time Calculations</span>
          </div>
          <div className="flex items-center gap-2.5 text-lg opacity-90">
            <FaPiggyBank className="text-2xl" />
            <span>Compound Interest</span>
          </div>
        </div>
      </header>

      <main className="py-10 px-5 max-w-[1200px] mx-auto">
        <div className="bg-white/5 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] p-8 animate-fadeIn backdrop-blur-[10px] border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 mb-10">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="initialInvestment" className="text-white/90 font-medium">Initial Investment (£)</label>
                <input
                  type="number"
                  placeholder="0"
                  id="initialInvestment"
                  value={initialInvestment}
                  onChange={handleInputChange(setInitialInvestment)}
                  className="px-4 py-3 border-2 border-white/10 rounded-[10px] text-base transition-all duration-300 bg-white/5 text-white focus:border-[#4CAF50] focus:bg-white/10 focus:outline-none focus:ring-[3px] focus:ring-[#4CAF50]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="monthlyContribution" className="text-white/90 font-medium">Monthly Contribution (£)</label>
                <input
                  type="number"
                  placeholder="500"
                  id="monthlyContribution"
                  value={monthlyContribution}
                  onChange={handleInputChange(setMonthlyContribution)}
                  className="px-4 py-3 border-2 border-white/10 rounded-[10px] text-base transition-all duration-300 bg-white/5 text-white focus:border-[#4CAF50] focus:bg-white/10 focus:outline-none focus:ring-[3px] focus:ring-[#4CAF50]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="investmentPeriod" className="text-white/90 font-medium">Investment Period (Years)</label>
                <input
                  type="number"
                  placeholder="10"
                  id="investmentPeriod"
                  value={investmentPeriod}
                  onChange={handleInputChange(setInvestmentPeriod)}
                  className="px-4 py-3 border-2 border-white/10 rounded-[10px] text-base transition-all duration-300 bg-white/5 text-white focus:border-[#4CAF50] focus:bg-white/10 focus:outline-none focus:ring-[3px] focus:ring-[#4CAF50]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="rate" className="text-white/90 font-medium">Interest Rate (%)</label>
                <input
                  type="number"
                  placeholder="8"
                  id="rate"
                  value={rate}
                  onChange={handleInputChange(setRate)}
                  className="px-4 py-3 border-2 border-white/10 rounded-[10px] text-base transition-all duration-300 bg-white/5 text-white focus:border-[#4CAF50] focus:bg-white/10 focus:outline-none focus:ring-[3px] focus:ring-[#4CAF50]/20"
                />
              </div>
            </div>

            <div className="bg-white/5 rounded-[15px] p-5 h-[400px] lg:h-[400px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-white/10">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          {futureValue && (
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/20 p-8 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-[#4CAF50]/30">
                <h3 className="m-0 mb-4 text-white text-2xl">Future Value</h3>
                <p className="m-0 mb-5 text-white/80 text-lg">At <strong>{rate}%</strong> return rate:</p>
                <span className="text-[2.5rem] max-md:text-[2rem] text-[#4CAF50] font-bold block">£{formatNumber(futureValue)}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-5 bg-white/5 text-white/60 text-sm border-t border-white/10">
        <p>This calculator is for illustrative purposes only and does not guarantee investment results.</p>
      </footer>
    </div>
  );
};

export default InvestmentCalculator; 