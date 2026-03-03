import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart } from 'chart.js/auto';

const InvestmentCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [rate, setRate] = useState(8);
  const [futureValue, setFutureValue] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
              color: '#ffffff',
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
              color: '#ffffff',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value (£)',
              color: '#ffffff',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          }
        }
      }
    });
  };

  const calculate = useCallback(() => {
    const principal = parseFloat(initialInvestment);
    const monthlyAmount = parseFloat(monthlyContribution);
    const years = parseInt(investmentPeriod);
    const monthlyRate = rate / 100 / 12;
    let currentValue = principal;
    const data = [currentValue];

    for (let i = 1; i <= years * 12; i++) {
      currentValue = currentValue * (1 + monthlyRate) + monthlyAmount;
      if (i % 12 === 0) data.push(currentValue);
    }

    setFutureValue(currentValue.toFixed(2));
    renderChart(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- renderChart uses refs, including causes infinite loop
  }, [initialInvestment, monthlyContribution, investmentPeriod, rate]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const handleInputChange = (setter) => (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)] max-w-[800px] mx-auto flex flex-col items-center text-white">
      <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 mb-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="initialInvestment" className="text-white/90 text-sm">Initial Investment (£):</label>
            <input
              type="number"
              placeholder="0"
              id="initialInvestment"
              value={initialInvestment}
              onChange={handleInputChange(setInitialInvestment)}
              className="w-full px-3 py-3 border-2 border-white/10 rounded-lg text-base transition-all duration-300 bg-white/5 text-white focus:border-[#4caf50] focus:outline-none focus:bg-white/10"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="monthlyContribution" className="text-white/90 text-sm">Monthly Contribution (£):</label>
            <input
              type="number"
              placeholder="500"
              id="monthlyContribution"
              value={monthlyContribution}
              onChange={handleInputChange(setMonthlyContribution)}
              className="w-full px-3 py-3 border-2 border-white/10 rounded-lg text-base transition-all duration-300 bg-white/5 text-white focus:border-[#4caf50] focus:outline-none focus:bg-white/10"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="investmentPeriod" className="text-white/90 text-sm">Investment Period (Years):</label>
            <input
              type="number"
              placeholder="10"
              id="investmentPeriod"
              value={investmentPeriod}
              onChange={handleInputChange(setInvestmentPeriod)}
              className="w-full px-3 py-3 border-2 border-white/10 rounded-lg text-base transition-all duration-300 bg-white/5 text-white focus:border-[#4caf50] focus:outline-none focus:bg-white/10"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="rate" className="text-white/90 text-sm">Interest Rate (%):</label>
            <input
              type="number"
              placeholder="8"
              id="rate"
              value={rate}
              onChange={handleInputChange(setRate)}
              className="w-full px-3 py-3 border-2 border-white/10 rounded-lg text-base transition-all duration-300 bg-white/5 text-white focus:border-[#4caf50] focus:outline-none focus:bg-white/10"
            />
          </div>
          <button onClick={calculate} className="w-full py-3 bg-[#4caf50] text-white border-none rounded-lg text-lg cursor-pointer transition-colors duration-300 mt-2.5 hover:bg-[#45a049]">Calculate</button>
        </div>

        <div className="w-full h-[300px] md:h-[300px] bg-white/5 rounded-xl p-5 border border-white/10">
          <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
      </div>

      {futureValue && (
        <div className="mt-8 w-full text-center">
          <h4 className="text-white text-lg mb-2.5">Future Value:</h4>
          <div className="bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/20 p-5 rounded-xl border border-[#4CAF50]/30">
            <p className="text-white/90 text-lg m-0 mb-2.5">At <strong>{rate}%</strong> return rate:</p>
            <span className="text-3xl md:text-[2rem] text-[#4caf50] font-bold">£{formatNumber(futureValue)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator; 