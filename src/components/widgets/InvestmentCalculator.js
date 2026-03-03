import React, { useState, useEffect, useRef } from 'react';
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

  const calculate = () => {
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
  };

  useEffect(() => {
    calculate();
  }, [initialInvestment, monthlyContribution, investmentPeriod, rate]);

  const handleInputChange = (setter) => (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  return (
    <div className="investment-calculator">
      <div className="calculator-content">
        <div className="calculator-inputs">
          <div className="input-group">
            <label htmlFor="initialInvestment">Initial Investment (£):</label>
            <input
              type="number"
              placeholder="0"
              id="initialInvestment"
              value={initialInvestment}
              onChange={handleInputChange(setInitialInvestment)}
              className="calculator-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="monthlyContribution">Monthly Contribution (£):</label>
            <input
              type="number"
              placeholder="500"
              id="monthlyContribution"
              value={monthlyContribution}
              onChange={handleInputChange(setMonthlyContribution)}
              className="calculator-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="investmentPeriod">Investment Period (Years):</label>
            <input
              type="number"
              placeholder="10"
              id="investmentPeriod"
              value={investmentPeriod}
              onChange={handleInputChange(setInvestmentPeriod)}
              className="calculator-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="rate">Interest Rate (%):</label>
            <input
              type="number"
              placeholder="8"
              id="rate"
              value={rate}
              onChange={handleInputChange(setRate)}
              className="calculator-input"
            />
          </div>
          <button onClick={calculate} className="calculate-button">Calculate</button>
        </div>

        <div className="calculator-chart">
          <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
      </div>

      {futureValue && (
        <div className="result">
          <h4>Future Value:</h4>
          <div className="result-box">
            <p>At <strong>{rate}%</strong> return rate:</p>
            <span className="future-value">£{formatNumber(futureValue)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator; 