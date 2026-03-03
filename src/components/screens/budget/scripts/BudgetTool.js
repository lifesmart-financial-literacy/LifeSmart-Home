/* eslint-disable no-unused-vars -- Budget tool has many computed values for future UI enhancements */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BudgetSpreadsheet, { downloadSpreadsheet } from './BudgetSpreadsheet';
import SpreadsheetModal from './SpreadsheetModal';
import BudgetWelcome from './BudgetWelcome';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Developer Testing Configuration
const DEV_TESTING_ENABLED = false; // Toggle this to enable/disable developer testing features

// Random number generation helper functions
const generateRandomAmount = (min = 100, max = 5000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomSelection = (options) => {
  return options[Math.floor(Math.random() * options.length)].value;
};

// Developer testing ranges for different expense types
const DEV_RANGES = {
  income: { min: 2000, max: 8000 },
  rent: { min: 800, max: 2500 },
  mortgage: { min: 1000, max: 3000 },
  utilities: { min: 100, max: 500 },
  transportation: { min: 100, max: 800 },
  groceries: { min: 200, max: 800 },
  healthInsurance: { min: 50, max: 400 },
  medicalExpenses: { min: 20, max: 300 },
  dining: { min: 100, max: 500 },
  entertainment: { min: 50, max: 400 },
  shopping: { min: 100, max: 800 },
  travel: { min: 100, max: 1000 },
  charity: { min: 20, max: 500 },
  emergency: { min: 1000, max: 10000 },
  sinking: { min: 500, max: 5000 },
  goal: { min: 1000, max: 20000 }
};

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Add an InfoButton component for tooltips
const InfoButton = ({ text }) => (
  <span className="bt-info-button" tabIndex="-1">
    <span className="bt-info-icon">💡</span>
    <span className="bt-info-tooltip">{text}</span>
  </span>
);

// Add this utility function at the top-level scope of BudgetTool
function getSecondMonthName() {
  const today = new Date();
  const secondMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  return secondMonth.toLocaleString('default', { month: 'long' });
}

const BudgetTool = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(-1); // Start at -1 for welcome page
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Add event handler for number inputs
  useEffect(() => {
    const preventWheel = (e) => {
      if (e.target.type === 'number') {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', preventWheel, { passive: false });
    return () => document.removeEventListener('wheel', preventWheel);
  }, []);

  const [formData, setFormData] = useState({
    // Income Information
    monthlyIncome: '',
    additionalIncome: '',
    
    // Housing Expenses
    housingType: 'rent',
    housingPayment: '',
    rent: '',
    mortgage: '',
    propertyTax: '',
    homeInsurance: '',
    utilities: '',
    
    // Transportation
    transportation: '',
    
    // Food & Dining
    groceries: '',
    diningOut: '',
    
    // Personal Care
    healthInsurance: '',
    medicalExpenses: '',
    gymMembership: '',
    personalCare: '',
    
    // Loans
    hasOtherLoans: 'no',
    otherLoanAmount: '',
    otherLoanPayment: '',
    loanPayments: '',
    
    // Entertainment & Leisure
    entertainment: '',
    shopping: '',
    subscriptions: '',
    travel: '',
    charity: '',
    
    // Savings & Investments
    hasSavingsPot: 'no',
    savingsPotType: 'one',
    emergencyFund: '',
    sinkingFund: '',
    goalFund: '',
    
    // 6-Month Projection
    incomeChange: 'no',
    incomeChangeMonth: '',
    needsChange: 'no',
    needsChangeMonth: '',
    wantsChange: 'no',
    wantsChangeMonth: '',
    monthlyProjections: Array(6).fill({
      income: 0,
      needs: 0,
      wants: 0,
      needsDetails: {},
      wantsDetails: {},
      savingsDetails: {}
    }),
    canReduceWants: '',
  });

  const questions = [
    {
      category: 'Income',
      description: (
        <>
          <div className="bt-step-description">
            <strong>Enter the money you receive each month.</strong>
          </div>
          <div className="flex items-center gap-[0.5em] my-4 mb-6">
            <InfoButton text={
              "Look through your bank statements for all the money coming in as part of your salary or other income"
            } />
            <span className="bt-info-popover-label">Where do I find this information?</span>
          </div>
        </>
      ),
      questions: [
        {
          id: 'monthlyIncome',
          label: (
            <>
              Net monthly income (after tax)
              <InfoButton text={"Use your average take-home pay; if it changes, take a 3-month average."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'additionalIncome',
          label: (
            <>
              Other regular income
              <InfoButton text={"Side hustle, benefits, maintenance, rental income, etc."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        }
      ],
    },
    {
      category: 'Needs',
      description: (
        <>
          <div className="bt-step-description">
            <strong>Add the costs you have to pay each month - housing, food, transport, utilities. Things that are non-negotiables.</strong>
          </div>
          <div className="flex items-center gap-[0.5em] my-4 mb-6">
            <InfoButton text={
              "Look through your bank statements. Many modern banks already categorise spending, but if not, you can use budgeting apps that connect your accounts and categorise the spending, like Snoop and MoneyWise (free version is sufficient)."
            } />
            <span className="bt-info-popover-label">Where do I find this information?</span>
          </div>
        </>
      ),
      questions: [
        {
          id: 'housingPayment',
          label: (
            <>
              Housing cost (rent / mortgage)
              <InfoButton text={"Rent or mortgage payment."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter your monthly housing payment',
          validation: (value) => {
            if (!value || value <= 0) return 'Please enter a valid housing payment';
            return null;
          }
        },
        {
          id: 'utilities',
          label: (
            <>
              Utilities
              <InfoButton text={"Electricity, gas, water, internet, phone."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'groceries',
          label: (
            <>
              Essential groceries
              <InfoButton text={"Supermarket food and living goods - not luxuries."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'transportation',
          label: (
            <>
              Transport
              <InfoButton text={"Fuel, public transport, insurance, road tax."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount for public transport, fuel, and car insurance/tax combined',
        },
        {
          id: 'healthInsurance',
          label: (
            <>
              Health costs
              <InfoButton text={"Insurance premiums, prescriptions, regular treatments."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
      ],
    },
    {
      category: 'Wants',
      description: (
        <>
          <div className="bt-step-description">
            <strong>Record the optional spending every month - dining out, shopping, hobbies, subscriptions.</strong>
          </div>
          <div className="flex items-center gap-[0.5em] my-4 mb-6">
            <InfoButton text={
              "Look through your bank statements. Many modern banks already categorise spending, but if not, you can use budgeting apps that connect your accounts and categorise the spending, like Snoop and MoneyWise."
            } />
            <span className="bt-info-popover-label">Where do I find this information?</span>
          </div>
        </>
      ),
      questions: [
        {
          id: 'diningOut',
          label: (
            <>
              Dining out & take-aways
              <InfoButton text={"Restaurants, takeaways, coffee shops."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'gymMembership',
          label: (
            <>
              Gym / sports / hobbies
              <InfoButton text={"Memberships, match fees, equipment."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'personalCare',
          label: (
            <>
              Personal care
              <InfoButton text={"Haircuts, skincare, massages."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'entertainment',
          label: (
            <>
              Entertainment
              <InfoButton text={"Cinema, gaming, nights out."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'shopping',
          label: (
            <>
              Shopping
              <InfoButton text={"Clothes, gadgets, books."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'subscriptions',
          label: (
            <>
              Subscriptions
              <InfoButton text={"Netflix, Spotify, Disney, etc."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'travel',
          label: (
            <>
              Travel & holidays
              <InfoButton text={"Enter your yearly total ÷ 12."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'charity',
          label: (
            <>
              Charity & gifts
              <InfoButton text={"Donations, presents."} />
            </>
          ),
          type: 'number',
          placeholder: 'Enter amount',
        },
      ],
    },
    {
      category: 'Spending Snapshot',
      description: (
        <>
          <div className="bt-step-description">
            <strong>See your spending snapshot and recommendations based on your inputs so far.</strong>
          </div>
        </>
      ),
      questions: [],
      renderCustomContent: (formData) => {
        // Pie chart and analysis previously in the old renderCustomContent
        const summary = calculateBudgetSummary();
        const totalIncome = summary.totalIncome;
        const needs = summary.needs;
        const wants = summary.wants;
        const needsPercentage = summary.needsPercentage;
        const wantsPercentage = summary.wantsPercentage;
        const remainingPercentage = summary.remainingPercentage;
        const recommendedSavings = (totalIncome - needs) * 0.33;
        const recommendedWants = (totalIncome - needs) * 0.67;
        const currentWants = wants;
        const wantsReduction = Math.max(0, currentWants - recommendedWants);
        const recommendedMinimumSavings = needs * 3;
        const recommendedIdealSavings = needs * 6;
        const currentSavings = Number(formData.totalSavings) || 0;
        const savingsGap = Math.max(0, recommendedMinimumSavings - currentSavings);
        return (
          <div className="bt-analysis">
            <h3 className="bt-analysis-title">Your Spending Snapshot</h3>
            <div className="bt-analysis-chart">
              <Pie
                data={{
                  labels: ['Needs', 'Wants', 'Savings'],
                  datasets: [
                    {
                      data: [
                        Math.max(0, summary.needs || 0),
                        Math.max(0, summary.wants || 0),
                        Math.max(0, (summary.totalIncome || 0) - (summary.needs || 0) - (summary.wants || 0))
                      ],
                      backgroundColor: [
                        'rgba(76, 175, 80, 0.85)',
                        'rgba(33, 150, 243, 0.85)',
                        'rgba(255, 193, 7, 0.85)'
                      ],
                      borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(33, 150, 243, 1)',
                        'rgba(255, 193, 7, 1)'
                      ],
                      borderWidth: 2,
                      hoverOffset: 15,
                      hoverBorderWidth: 3
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#ffffff',
                        font: {
                          size: 14,
                          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${context.label}: £${value.toFixed(2)} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  cutout: '60%',
                  radius: '80%'
                }}
              />
              {/* Show percentages next to the pie chart */}
              <div className="bt-piechart-percentages">
                <div className="bt-piechart-percentage-card needs">Needs: {needsPercentage.toFixed(1)}%</div>
                <div className="bt-piechart-percentage-card wants">Wants: {wantsPercentage.toFixed(1)}%</div>
                <div className="bt-piechart-percentage-card savings">Savings: {remainingPercentage.toFixed(1)}%</div>
              </div>
            </div>
            <div className="mt-10 text-white">
              <div className="bt-analysis-rule">
                <strong>Smart Spending Rule:</strong>
                <ul>
                  <li>Pay your needs</li>
                  <li>Pay yourself (save 1/3rd)</li>
                  <li>Spend and enjoy what's left</li>
                </ul>
                <div style={{ marginTop: '0.5em', color: '#cccccc' }}>
                  Our guideline is that, while your necessities are fixed in the short term, from the remaining, you should save <strong>1/3<sup>rd</sup></strong> and spend <strong>2/3<sup>rd</sup></strong> on your wants.
                </div>
              </div>
              {wantsReduction > 0 && (
                <div className="bt-analysis-warning">
                  <strong>Top Tip:</strong> You need to reduce your wants spending by £{wantsReduction.toFixed(2)} each month to hit that target.
                </div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      category: 'Savings Deep Dive',
      description: (
        <>
          <div className="bt-step-description">
            <strong>Savings are the foundation you need to deal with issues, start investing and reach financial freedom.</strong>
          </div>
        </>
      ),
      questions: [],
      renderCustomContent: (formData, setFormData) => {
        // Helper for currency
        const formatCurrency = (value) => `£${Number(value || 0).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
        // Calculate essentials (needs) for emergency fund using the same logic as calculateBudgetSummary
        const essentials =
          Number(formData.housingPayment || 0) +
          Number(formData.utilities || 0) +
          Number(formData.transportation || 0) +
          Number(formData.groceries || 0) +
          Number(formData.healthInsurance || 0) +
          Number(formData.medicalExpenses || 0) +
          Number(formData.otherLoanPayment || 0);
        const emergencyMin = essentials * 3;
        const totalSavings = Number(formData.totalSavings) || 0;
        const currentEmergency = Math.min(totalSavings, emergencyMin);
        const emergencyShortfall = Math.max(0, emergencyMin - totalSavings);
        const recommendedMonthlySaving = Math.round((formData.monthlyIncome - essentials) * 0.33) || 0;
        const monthsToTarget = recommendedMonthlySaving > 0 ? Math.ceil(emergencyShortfall / recommendedMonthlySaving) : null;
        // Sinking Fund
        const plannedExpenses = Number(formData.sinkingPlannedExpenses) || 0;
        const sinkingFund = Math.max(0, totalSavings - emergencyMin);
        // Goal/Investment Fund
        const goalFund = Math.max(0, totalSavings - emergencyMin - plannedExpenses);
        // Handlers
        const handleEditTotalSavings = () => {
          const val = prompt('Enter your total savings:', formData.totalSavings || '');
          if (val !== null && !isNaN(val)) setFormData({ ...formData, totalSavings: val });
        };
        const handleEditGoalFund = () => {
          const val = prompt('Enter your current goal/investment fund:', formData.goalFund || goalFund || '');
          if (val !== null && !isNaN(val)) setFormData({ ...formData, goalFund: val });
        };
        return (
          <div className="bt-savings-deepdive">
            {/* Total Savings */}
            <div className="bt-savings-deepdive-row">
              <span className="bt-savings-deepdive-label">Total Savings:</span>
              <span className="bt-savings-deepdive-value">{formatCurrency(totalSavings)}</span>
              <button className="bt-savings-deepdive-edit" onClick={handleEditTotalSavings}>Edit</button>
            </div>
            {/* Emergency Fund */}
            <div className="bt-savings-deepdive-section">
              <div className="bt-savings-deepdive-title">Emergency Fund</div>
              <div className="bt-savings-deepdive-row">
                <span>Minimum Amount (3 months of Essentials):</span>
                <span>{formatCurrency(emergencyMin)}</span>
              </div>
              <div className="bt-savings-deepdive-row">
                <span>Current Savings:</span>
                <span>{formatCurrency(currentEmergency)}</span>
              </div>
              <div className="bt-savings-deepdive-row bt-savings-deepdive-action">
                {emergencyShortfall > 0 ? (
                  <>
                    <span>Action:</span>
                    <span>You need another {formatCurrency(emergencyShortfall)} to reach the minimum amount. {monthsToTarget !== null && `Based on your ideal savings target above this will take ${monthsToTarget} month${monthsToTarget > 1 ? 's' : ''} to build up.`}</span>
                  </>
                ) : (
                  <span>Fantastic, you have enough in your savings to cover this. Make sure you keep it aside from your other savings funds.</span>
                )}
              </div>
            </div>
            {/* Sinking Fund */}
            <div className="bt-savings-deepdive-section">
              <div className="bt-savings-deepdive-title">Sinking Fund</div>
              <div className="bt-savings-deepdive-row">
                <span>Total planned expenses:</span>
                <input
                  type="number"
                  className="bt-savings-deepdive-input"
                  value={formData.sinkingPlannedExpenses || ''}
                  onChange={e => setFormData({ ...formData, sinkingPlannedExpenses: e.target.value })}
                  placeholder="Enter amount"
                />
                <InfoButton text="Estimate any large expenses you have coming up in the next couple of years that aren't part of your usual spending such as home repair, wedding, large holiday etc. If you do not have any, then you can leave this blank." />
              </div>
              <div className="bt-savings-deepdive-row">
                <span>Current Fund Balance:</span>
                <span>{formatCurrency(sinkingFund)}</span>
              </div>
            </div>
            {/* Goal / Investment Fund */}
            <div className="bt-savings-deepdive-section">
              <div className="bt-savings-deepdive-title">Goal / Investment Fund</div>
              <div className="bt-savings-deepdive-row">
                <span>Current goal/Investment fund:</span>
                <span>{formatCurrency(formData.goalFund || goalFund)}</span>
                <button className="bt-savings-deepdive-edit" onClick={handleEditGoalFund}>Edit</button>
              </div>
              <div className="bt-savings-deepdive-info">
                Any remaining savings can be used towards the longer term goals you may have or invested to grow your wealth. If you currently have any investments that you haven't considered part of your savings, or aren't mentioned previously, update the number now.
              </div>
            </div>
          </div>
        );
      }
    },
    {
      category: '6-Month Outline',
      description: (formData) => {
        // Calculate total projected savings increase
        const totalIncrease = (formData.monthlyProjections || []).reduce((sum, m) => sum + (Number(m.savings) || 0), 0);
        const formatCurrency = (value) => `£${Number(value || 0).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
        function getSecondMonthName() {
          const today = new Date();
          const secondMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
          return secondMonth.toLocaleString('default', { month: 'long' });
        }
        return (
          <div className="bt-step-description">
            <strong>Fantastic, below is your spending and saving outline for the next 6 months.</strong><br />
            Based on this, your savings will have increased by {formatCurrency(totalIncrease)}.<br /><br />
            <span className="bt-step-action">
              Action: During the first week of {getSecondMonthName()}, you need to come and enter the actual spend figures to see if you are on track.
            </span>
          </div>
        );
      },
      questions: [],
      renderCustomContent: (formData) => {
        const getNextMonths = () => {
          const months = [];
          const today = new Date();
          for (let i = 0; i < 6; i++) {
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);
            months.push(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
          }
          return months;
        };

        const nextMonths = getNextMonths();
        const summary = calculateBudgetSummary();

        return (
          <div className="bt-projections">
            <h3 className="bt-projections-title">6-Month Projection</h3>
            
            {/* Income Section */}
            <div className="bt-projections-section">
              <div className="bt-projections-question">
                <label>Do you expect your income to change over the next 6 months?</label>
                <select
                  name="incomeChange"
                  value={formData.incomeChange}
                  onChange={handleInputChange}
                  className="bt-input"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.incomeChange === 'yes' && (
                <div className="bt-projections-table mt-6 w-full overflow-x-auto">
                  <h4>Expected Income Changes</h4>
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>Month</th>
                          {nextMonths.map((month, index) => (
                            <th key={index}>{month}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Monthly Income</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.income || summary.totalIncome}
                                onChange={(e) => handleAmountChange(index, 'income', e.target.value)}
                                className="bt-input bt-input-number"
                                placeholder={`£${summary.totalIncome.toFixed(2)}`}
                              />
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Needs Section */}
            <div className="bt-projections-section">
              <div className="bt-projections-question">
                <label>Do you expect your needs spending to change over the next 6 months?</label>
                <select
                  name="needsChange"
                  value={formData.needsChange}
                  onChange={handleInputChange}
                  className="bt-input"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.needsChange === 'yes' && (
                <div className="bt-projections-table mt-6 w-full overflow-x-auto">
                  <h4>Expected Needs Changes</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        {nextMonths.map((month, index) => (
                          <th key={index}>{month}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Housing cost (rent / mortgage)</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.housingPayment || Number(formData.housingPayment || 0)}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.housingPayment', e.target.value)}
                              className="bt-input bt-input-number"
                              placeholder={`£${Number(formData.housingPayment || 0).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Utilities</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.utilities || Number(formData.utilities || 0)}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.utilities', e.target.value)}
                              className="bt-input bt-input-number"
                              placeholder={`£${Number(formData.utilities || 0).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Essential groceries</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.groceries || Number(formData.groceries || 0)}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.groceries', e.target.value)}
                              className="bt-input bt-input-number"
                              placeholder={`£${Number(formData.groceries || 0).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Transport</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.transportation || Number(formData.transportation || 0)}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.transportation', e.target.value)}
                              placeholder={`£${Number(formData.transportation || 0).toFixed(2)}`}
                              className="bt-input bt-input-number"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Health costs</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.healthInsurance || Number(formData.healthInsurance || 0)}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.healthInsurance', e.target.value)}
                              placeholder={`£${Number(formData.healthInsurance || 0).toFixed(2)}`}
                              className="bt-input bt-input-number"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Medical Expenses</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.medicalExpenses || Number(formData.medicalExpenses || 0)}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.medicalExpenses', e.target.value)}
                              placeholder={`£${Number(formData.medicalExpenses || 0).toFixed(2)}`}
                              className="bt-input bt-input-number"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Loan Payments</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.loanPayments || Number(formData.otherLoanPayment || 0)}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.loanPayments', e.target.value)}
                              placeholder={`£${Number(formData.otherLoanPayment || 0).toFixed(2)}`}
                              className="bt-input bt-input-number"
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Wants Section */}
            <div className="bt-projections-section">
              <div className="bt-projections-question">
                <label>Do you think you can change your wants spending over the next 6 months?</label>
                <select
                  name="wantsChange"
                  value={formData.wantsChange}
                  onChange={handleInputChange}
                  className="bt-input"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.wantsChange === 'yes' && (
                <div className="bt-projections-table mt-6 w-full overflow-x-auto">
                  <h4>Expected Wants Changes</h4>
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>Category</th>
                          {nextMonths.map((month, index) => (
                            <th key={index}>{month}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Entertainment</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.wantsDetails?.entertainment || formData.entertainment || ''}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.entertainment', e.target.value)}
                                className="bt-input bt-input-number"
                                placeholder={`£${Number(formData.entertainment || 0).toFixed(2)}`}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Shopping</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.wantsDetails?.shopping || formData.shopping || ''}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.shopping', e.target.value)}
                                className="bt-input bt-input-number"
                                placeholder={`£${Number(formData.shopping || 0).toFixed(2)}`}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Dining Out & Takeout</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.wantsDetails?.diningOut || formData.diningOut || ''}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.diningOut', e.target.value)}
                                placeholder={`£${Number(formData.diningOut || 0).toFixed(2)}`}
                                className="bt-input bt-input-number"
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Personal Care</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.wantsDetails?.personalCare || formData.personalCare || ''}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.personalCare', e.target.value)}
                                className="bt-input bt-input-number"
                                placeholder={`£${Number(formData.personalCare || 0).toFixed(2)}`}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Gym Membership</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.wantsDetails?.gymMembership || formData.gymMembership || ''}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.gymMembership', e.target.value)}
                                className="bt-input bt-input-number"
                                placeholder={`£${Number(formData.gymMembership || 0).toFixed(2)}`}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Subscriptions</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.wantsDetails?.subscriptions || formData.subscriptions || ''}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.subscriptions', e.target.value)}
                                className="bt-input bt-input-number"
                                placeholder={`£${Number(formData.subscriptions || 0).toFixed(2)}`}
                              />
                            </td>
                          ))} 
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 text-[#cccccc] text-center">
              <p>
                Please come back after one month and enter the actual figures to compare with these projections.
                This will help you track your progress and make necessary adjustments to your budget.
              </p>
            </div>
          </div>
        );
      }
    },
  ];

  const calculateBudgetSummary = () => {
    // Calculate total income
    const totalIncome = Number(formData.monthlyIncome || 0) + Number(formData.additionalIncome || 0);

    // Calculate total needs
    const needs = Number(formData.housingPayment || 0) +
      Number(formData.utilities || 0) +
      Number(formData.transportation || 0) +
      Number(formData.groceries || 0) +
      Number(formData.healthInsurance || 0) +
      Number(formData.medicalExpenses || 0) +
      Number(formData.otherLoanPayment || 0);

    // Calculate total wants
    const wants = Number(formData.subscriptions || 0) +
      Number(formData.diningOut || 0) +
      Number(formData.gymMembership || 0) +
      Number(formData.shopping || 0) +
      Number(formData.entertainment || 0) +
      Number(formData.travel || 0) +
      Number(formData.charity || 0);

    // Calculate total savings
    const totalSavings = Number(formData.totalSavings || 0);
    
    // Calculate percentages
    const needsPercentage = totalIncome > 0 ? (needs / totalIncome) * 100 : 0;
    const wantsPercentage = totalIncome > 0 ? (wants / totalIncome) * 100 : 0;
    const savingsPercentage = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
    const remainingPercentage = Math.max(0, 100 - needsPercentage - wantsPercentage);

    return {
      totalIncome,
      needs,
      wants,
      totalSavings,
      needsPercentage,
      wantsPercentage,
      savingsPercentage,
      remainingPercentage,
      housingPayment: Number(formData.housingPayment || 0)
    };
  };

  const handleAmountChange = (monthIndex, field, value) => {
    setFormData(prev => {
      const newProjections = [...prev.monthlyProjections];
      if (!newProjections[monthIndex]) {
        newProjections[monthIndex] = {
          needsDetails: {},  // Initialize needsDetails
          wantsDetails: {},  // Initialize wantsDetails
        };
      }

      // If updating needs details
      if (field.startsWith('needsDetails.')) {
        const needsKey = field.split('.')[1];
        newProjections[monthIndex] = {
          ...newProjections[monthIndex],
          needsDetails: {
            ...newProjections[monthIndex].needsDetails || {},
            [needsKey]: Number(value) || 0
          }
        };
        
        // Calculate total needs from all needs categories
        const totalNeeds = Object.values({
          housing: Number(formData.housingPayment || 0),
          utilities: Number(formData.utilities || 0),
          transportation: Number(formData.transportation || 0),
          groceries: Number(formData.groceries || 0),
          healthInsurance: Number(formData.healthInsurance || 0),
          medicalExpenses: Number(formData.medicalExpenses || 0),
          loanPayments: Number(formData.otherLoanPayment || 0),
          ...newProjections[monthIndex].needsDetails
        }).reduce((sum, val) => sum + (Number(val) || 0), 0);
        
        // Update the total needs for this month
        newProjections[monthIndex].needs = totalNeeds;
      }
      // If updating wants details
      else if (field.startsWith('wantsDetails.')) {
        const wantsKey = field.split('.')[1];
        newProjections[monthIndex] = {
          ...newProjections[monthIndex],
          wantsDetails: {
            ...newProjections[monthIndex].wantsDetails || {},
            [wantsKey]: Number(value) || 0
          }
        };
        
        // Calculate total wants from all wants categories
        const totalWants = Object.values({
          entertainment: Number(formData.entertainment || 0),
          shopping: Number(formData.shopping || 0),
          diningOut: Number(formData.diningOut || 0),
          personalCare: Number(formData.personalCare || 0),
          gymMembership: Number(formData.gymMembership || 0),
          subscriptions: Number(formData.subscriptions || 0),
          travel: Number(formData.travel || 0),
          charity: Number(formData.charity || 0),
          ...newProjections[monthIndex].wantsDetails
        }).reduce((sum, val) => sum + (Number(val) || 0), 0);
        
        // Update the total wants for this month
        newProjections[monthIndex].wants = totalWants;
      } else {
        newProjections[monthIndex] = {
          ...newProjections[monthIndex],
          [field]: Number(value) || 0
        };
      }

      return {
        ...prev,
        monthlyProjections: newProjections
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updates = {
        ...prev,
        [name]: value
      };

      // When other loan payment changes, update loanPayments field
      if (name === 'otherLoanPayment') {
        updates.loanPayments = value;
      }
      // When hasOtherLoans changes to 'no', clear loan-related fields
      if (name === 'hasOtherLoans' && value === 'no') {
        updates.otherLoanAmount = '';
        updates.otherLoanPayment = '';
        updates.loanPayments = '';
      }

      return updates;
    });
  };

  const handleNext = () => {
    if (currentStep === -1) {
      // Move from welcome page to first step
      setCurrentStep(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === questions.length - 1) {
      setCurrentStep(prev => prev + 1); // Move to step 7
      setShowSpreadsheet(true); // Show spreadsheet modal
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      // Move from first step back to welcome page
      setCurrentStep(-1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (currentStep === questions.length) { // If on step 7
        setShowSpreadsheet(false); // Hide spreadsheet modal
      }
    }
  };

  const handleDownloadSpreadsheet = () => {
    downloadSpreadsheet(formData);
  };

  const renderSavingsInfo = () => {
    if (formData.hasSavingsPot === 'no') {
      return (
        <div className="bt-savings-info">
          <h3 className="bt-savings-title">Understanding Savings Pots</h3>
          <p className="bt-savings-text">
            Having a structured approach to savings is crucial for financial stability. We recommend setting up three distinct savings pots:
          </p>
          <div className="bt-savings-pots">
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">🛡️</div>
              <h4>Emergency Fund</h4>
              <p>3-6 months of essential expenses for unexpected situations</p>
            </div>
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">🎯</div>
              <h4>Sinking Fund</h4>
              <p>For planned future expenses like holidays or home repairs</p>
            </div>
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">💎</div>
              <h4>Goal/Investment Fund</h4>
              <p>For long-term goals and building wealth</p>
            </div>
          </div>
        </div>
      );
    }

    if (formData.savingsPotType === 'one') {
      return (
        <div className="bt-savings-info">
          <h3 className="bt-savings-title">Multiple Savings Pots</h3>
          <p className="bt-savings-text">
            While having a single savings pot is a good start, it's important to build up multiple savings pots that have different roles. Here's how we suggest you structure your savings:
          </p>
          <div className="bt-savings-pots">
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">🛡️</div>
              <h4>Emergency Fund</h4>
              <p>3-6 months of essential expenses for unexpected situations</p>
            </div>
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">🎯</div>
              <h4>Sinking Fund</h4>
              <p>For planned future expenses like holidays or home repairs</p>
            </div>
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">💎</div>
              <h4>Goal/Investment Fund</h4>
              <p>For long-term goals and wealth building</p>
            </div>
          </div>
        </div>
      );
    }

    if (formData.savingsPotType === 'multiple') {
      return (
        <div className="bt-savings-info">
          <h3 className="bt-savings-title">Great Job!</h3>
          <p className="bt-savings-text">
            You're on the right track with multiple savings pots. Let's review your current savings structure:
          </p>
          <div className="bt-savings-pots">
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">🛡️</div>
              <h4>Emergency Fund</h4>
              <p>3-6 months of essential expenses for unexpected situations</p>
            </div>
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">🎯</div>
              <h4>Sinking Fund</h4>
              <p>For planned future expenses like holidays or home repairs</p>
            </div>
            <div className="bt-savings-pot">
              <div className="bt-savings-pot-icon">💎</div>
              <h4>Goal/Investment Fund</h4>
              <p>For long-term goals and wealth building</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderQuestion = (question) => {
    if (question.showIf && !question.showIf(formData)) {
      return null;
    }

    return (
      <div className="mb-6">
        <label className="bt-label">{question.label}</label>
        {(() => {
          switch (question.type) {
            case 'number':
              return (
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="number"
                    name={question.id}
                    value={formData[question.id]}
                    onChange={handleInputChange}
                    placeholder={question.placeholder}
                    className="bt-input bt-input-number"
                  />
                </div>
              );
            case 'select':
              return (
                <>
                  <select
                    name={question.id}
                    value={formData[question.id]}
                    onChange={handleInputChange}
                    className="bt-input"
                  >
                    <option value="">Select option</option>
                    {question.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {question.renderAfter && question.renderAfter(formData)}
                </>
              );
            case 'multiselect':
              return (
                <div className="flex flex-col gap-3 mt-2">
                  {question.options.map(option => (
                    <label 
                      key={option.value} 
                      className="bt-checkbox-label"
                      data-checked={formData[question.id]?.includes(option.value)}
                    >
                      <input
                        type="checkbox"
                        name={question.id}
                        value={option.value}
                        checked={formData[question.id]?.includes(option.value) || false}
                        onChange={(e) => {
                          const currentValues = formData[question.id] || [];
                          let newValues;
                          if (option.value === 'none') {
                            // If 'none' is selected, clear all other selections
                            newValues = e.target.checked ? ['none'] : [];
                          } else {
                            // If any other option is selected, remove 'none' and toggle the selected option
                            newValues = currentValues.filter(v => v !== 'none');
                            if (e.target.checked) {
                              newValues.push(option.value);
                            } else {
                              newValues = newValues.filter(v => v !== option.value);
                            }
                          }
                          setFormData(prev => ({
                            ...prev,
                            [question.id]: newValues
                          }));
                        }}
                        className="bt-checkbox"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              );
            case 'display':
              return (
                <div>
                  {question.getValue(formData)}
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  // Helper function to format currency values
  const formatCurrency = (value) => `£${Number(value || 0).toFixed(2)}`;

  // Helper function to get housing payment label
  const getHousingPaymentLabel = () => {
    return formData.housingType === 'mortgage' ? 'Mortgage Payment' : 'Rent Payment';
  };

  // Add a helper function to calculate total wants for a month
  const calculateMonthlyWants = (month) => {
    if (!month) return 0;
    
    if (month.wantsDetails) {
      return Object.values(month.wantsDetails).reduce((sum, val) => sum + (Number(val) || 0), 0);
    }
    
    // Fallback to direct wants value if wantsDetails is not available
    return Number(month.wants || 0);
  };

  // Add helper function to get month names
  const getNextMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);
      months.push(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
    return months;
  };

  // Add helper function to calculate wants percentage change
  const calculateWantsChange = (currentMonth, previousMonth) => {
    if (!previousMonth) return 'N/A';
    
    const currentWants = calculateMonthlyWants(currentMonth);
    const previousWants = calculateMonthlyWants(previousMonth);
    
    if (previousWants === 0) return 'N/A';
    return `${((currentWants - previousWants) / previousWants * 100).toFixed(1)}%`;
  };

  const downloadBudgetSpreadsheet = () => {
    // Calculate summary data
    const summary = calculateBudgetSummary();
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      // Title
      ['Budget Overview'],
      [],
      
      // Income Information
      ['Income Information'],
      ['Category', 'Amount', 'Frequency'],
      ['Monthly Income', formData.monthlyIncome, 'Monthly'],
      ['Additional Income', formData.additionalIncome, 'Monthly'],
      ['Total Income', summary.totalIncome, 'Monthly'],
      [],
      
      // Housing Expenses
      ['Housing Expenses'],
      ['Category', 'Amount', 'Type'],
      [getHousingPaymentLabel(), summary.housingPayment, 'Needs'],
      ...(formData.housingType === 'mortgage' ? [
        ['Property Tax', formData.propertyTax, 'Needs'],
        ['Home Insurance', formData.homeInsurance, 'Needs']
      ] : []),
      ['Utilities', formData.utilities, 'Needs'],
      [],
      
      // Transportation
      ['Transportation'],
      ['Category', 'Amount', 'Type'],
      ['Transportation Expenses', formData.transportation, 'Needs'],
      [],
      
      // Food & Dining
      ['Food & Dining'],
      ['Category', 'Amount', 'Type'],
      ['Groceries', formData.groceries, 'Needs'],
      ['Dining Out', formData.diningOut, 'Wants'],
      [],
      
      // Personal Care
      ['Personal Care'],
      ['Category', 'Amount', 'Type'],
      ['Health Insurance', formData.healthInsurance, 'Needs'],
      ['Medical Expenses', formData.medicalExpenses, 'Needs'],
      ['Gym Membership', formData.gymMembership, 'Wants'],
      ['Personal Care', formData.personalCare, 'Wants'],
      [],
      
      // Entertainment & Leisure
      ['Entertainment & Leisure'],
      ['Category', 'Amount', 'Type'],
      ['Entertainment', formData.entertainment, 'Wants'],
      ['Shopping', formData.shopping, 'Wants'],
      ['Subscriptions', formData.subscriptions, 'Wants'],
      ['Travel', formData.travel, 'Wants'],
      [],
      
      // Savings Information
      ['Savings Information'],
      ['Category', 'Amount', 'Type'],
      ['Has Savings Pot', formData.hasSavingsPot === 'yes' ? 'Yes' : 'No', 'Status'],
      ['Savings Pot Type', formData.savingsPotType || 'Not specified', 'Type'],
      ['Emergency Fund', formData.emergencyFund, 'Current Balance'],
      ['Sinking Fund', formData.sinkingFund, 'Current Balance'],
      ['Goal/Investment Fund', formData.goalFund, 'Current Balance'],
      ['Monthly Savings', summary.monthlySavings, 'Monthly'],
      ['Total Savings', summary.totalSavings, 'Total'],
      [],
      
      // Current Budget Summary
      ['Current Budget Summary'],
      ['Category', 'Amount', 'Percentage'],
      ['Total Income', summary.totalIncome, '100%'],
      ['Needs', summary.needs, `${summary.needsPercentage.toFixed(1)}%`],
      ['Wants', summary.totalWants, `${summary.wantsPercentage.toFixed(1)}%`],
      ['Available for Savings', summary.monthlySavings, `${summary.remainingPercentage.toFixed(1)}%`],
      [],
      
      // 6-Month Projection
      ['6-Month Projection'],
      ['Month', 'Income', 'Needs', 'Wants', 'Savings', 'Savings Pot', 'Income Change', 'Needs Change', 'Wants Change']
    ]);

    // Add monthly projection data
    if (formData.monthlyProjections && formData.monthlyProjections.length > 0) {
      const nextMonths = getNextMonths();
      formData.monthlyProjections.forEach((month, index) => {
        const prevMonth = index > 0 ? formData.monthlyProjections[index - 1] : null;
        const monthlyWants = calculateMonthlyWants(month);
        
        // Calculate cumulative savings pot
        const currentSavingsPot = summary.currentSavings + 
          formData.monthlyProjections
            .slice(0, index + 1)
            .reduce((sum, m) => sum + (Number(m.savings) || 0), 0);
        
        // Calculate percentage changes
        const incomeChange = prevMonth ? 
          ((month.income - prevMonth.income) / prevMonth.income * 100).toFixed(1) + '%' : 'N/A';
        const needsChange = prevMonth ? 
          ((month.needs - prevMonth.needs) / prevMonth.needs * 100).toFixed(1) + '%' : 'N/A';
        const wantsChange = calculateWantsChange(month, prevMonth);
        
        XLSX.utils.sheet_add_aoa(ws, [[
          nextMonths[index],
          month.income,
          month.needs,
          monthlyWants,
          month.savings,
          currentSavingsPot,
          incomeChange,
          needsChange,
          wantsChange
        ]], { origin: -1 });
      });
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Budget Overview');

    // Generate and download the file
    XLSX.writeFile(wb, 'budget_overview.xlsx');
  };


  const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="bt-modal-overlay">
        <div className="bt-modal-content w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[20px] p-8 shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[1.8rem] text-white m-0">Confirm Navigation</h2>
            <button onClick={onClose} className="bt-modal-close bg-transparent border-none text-white text-3xl cursor-pointer p-2 leading-none opacity-70 hover:opacity-100 transition-opacity rounded">&times;</button>
          </div>
          <div className="bt-modal-body text-white">
            <p className="text-xl text-center my-8 leading-relaxed">Are you SURE you want to leave yet?</p>
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={onClose} variant="outline" className="min-w-[120px] border-white/20 bg-transparent text-white hover:bg-white/10">
                Stay Here
              </Button>
              <Button onClick={onConfirm} className="min-w-[120px] bg-gradient-to-br from-[#4CAF50] to-[#2196F3] text-white hover:opacity-90">
                Yes, Leave
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showSpreadsheet) {
    const totalIncrease = (formData.monthlyProjections || []).reduce((sum, m) => sum + (Number(m.savings) || 0), 0);
    const formatCurrency = (value) => `£${Number(value || 0).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
    return (
      <div className="bt-container min-h-screen flex justify-center items-center p-8 text-white">
        <div className="bt-content w-full rounded-[20px] p-10 shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
          <header className="text-center mb-8">
            <h1 className="bt-title text-4xl mb-4">Wealth Map</h1>
          </header>

          <div className="mb-8">
            <div 
              className="bt-progress-bar h-1.5 rounded transition-[width] duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / (questions.length + 1)) * 100}%` }}
            ></div>
            <p className="text-center mt-2 text-[#cccccc] text-sm">
              Step {currentStep + 1} of {questions.length + 1}
            </p>
          </div>

          {currentStep === questions.length ? (
            <div className="bt-step-description">
              <strong>Fantastic, below is your spending and saving outline for the next 6 months.</strong><br />
              <span className="bt-step-action">
                Action: During the first week of {getSecondMonthName()}, you need to come and enter the actual spend figures to see if you are on track.
              </span>
            </div>
          ) : null}

          <div className="bt-spreadsheet-step">
            <BudgetSpreadsheet formData={formData} />
          </div>

          <div className="flex justify-between gap-4 flex-wrap">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStep === 0}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 disabled:opacity-50"
            >
              Previous
            </Button>
            <div className="flex gap-4">
              <Button
                onClick={() => setIsConfirmModalOpen(true)}
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                Return to Select
              </Button>
              <Button
                onClick={handleDownloadSpreadsheet}
                className="bg-gradient-to-br from-[#4CAF50] to-[#2196F3] text-white hover:opacity-90"
              >
                Download Spreadsheet
              </Button>
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => navigate('/select')}
        />
      </div>
    );
  }

  return (
    <div className="bt-container min-h-screen flex justify-center items-center p-8 text-white">
      <div className="bt-content w-full rounded-[20px] p-10 shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
        {currentStep === -1 ? (
          <BudgetWelcome onNext={handleNext} />
        ) : (
          <>
            <header className="text-center mb-8">
              <h1 className="bt-title text-4xl mb-4">Budget Planning Tool</h1>
              <p className="bt-subtitle text-lg">Let's get started with your financial information</p>
            </header>

            <div className="mb-8">
              <div 
                className="bt-progress-bar h-1.5 rounded transition-[width] duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / (questions.length + 1)) * 100}%` }}
              ></div>
              <p className="bt-progress-text">
                Step {currentStep + 1} of {questions.length + 1}
              </p>
            </div>

            <div className="mb-8">
              {currentStep < questions.length ? (
                <>
                  {DEV_TESTING_ENABLED && (
                    <div className="mb-4 p-4 bg-black/20 rounded-lg">
                      <div style={{ marginBottom: '0.5rem', color: '#ffc107', fontFamily: 'monospace' }}>
                        🛠️ Developer Testing Mode: ON
                      </div>
                      <button
                        onClick={() => {
                          const newFormData = { ...formData };
                          
                          // Handle standard questions if they exist
                          if (questions[currentStep].questions.length > 0) {
                            questions[currentStep].questions.forEach(question => {
                              if (!question.showIf || question.showIf(formData)) {
                                if (question.type === 'number') {
                                  const range = Object.entries(DEV_RANGES).find(([key]) => 
                                    question.id.toLowerCase().includes(key)
                                  );
                                  const { min, max } = range ? range[1] : { min: 100, max: 5000 };
                                  newFormData[question.id] = generateRandomAmount(min, max).toString();
                                } else if (question.type === 'select') {
                                  newFormData[question.id] = generateRandomSelection(question.options);
                                } else if (question.type === 'multiselect' && question.options) {
                                  const numSelections = Math.floor(Math.random() * 3) + 1;
                                  const shuffled = [...question.options].sort(() => 0.5 - Math.random());
                                  newFormData[question.id] = shuffled.slice(0, numSelections).map(opt => opt.value);
                                }
                              }
                            });
                          }
                          
                          // Special handling for 6-Month Projection step
                          if (currentStep === 5) { // 6-Month Projection step
                            // Always set all changes to yes
                            newFormData.incomeChange = 'yes';
                            newFormData.needsChange = 'yes';
                            newFormData.wantsChange = 'yes';
                            
                            // Get current summary for base values
                            const summary = calculateBudgetSummary();
                            
                            // Generate monthly projections with realistic variations
                            const monthlyProjections = Array(6).fill().map((_, index) => {
                              const variationRange = 0.15; // 15% variation range
                              const getRandomVariation = () => 1 + (Math.random() * variationRange * 2 - variationRange);
                              
                              // Generate variations for income
                              const income = Math.round(summary.totalIncome * getRandomVariation());
                              
                              // Get the correct housing payment based on type
                              const baseHousingPayment = formData.housingType === 'mortgage' 
                                ? Number(formData.mortgage || 0) 
                                : Number(formData.rent || 0);
                                
                              // Generate variations for needs categories
                              const needsDetails = {
                                housing: Math.round(baseHousingPayment * getRandomVariation()),
                                transportation: Math.round((Number(formData.transportation) || generateRandomAmount(DEV_RANGES.transportation.min, DEV_RANGES.transportation.max)) * getRandomVariation()),
                                groceries: Math.round(Number(formData.groceries) * getRandomVariation()),
                                healthInsurance: Math.round((Number(formData.healthInsurance) || generateRandomAmount(DEV_RANGES.healthInsurance.min, DEV_RANGES.healthInsurance.max)) * getRandomVariation()),
                                medicalExpenses: Math.round((Number(formData.medicalExpenses) || generateRandomAmount(DEV_RANGES.medicalExpenses.min, DEV_RANGES.medicalExpenses.max)) * getRandomVariation()),
                                utilities: Math.round(Number(formData.utilities) * getRandomVariation()),
                                propertyTax: formData.housingType === 'mortgage' ? Math.round(Number(formData.propertyTax) * getRandomVariation()) : 0,
                                homeInsurance: formData.housingType === 'mortgage' ? Math.round(Number(formData.homeInsurance) * getRandomVariation()) : 0
                              };
                              
                              // Generate variations for wants categories
                              const wantsDetails = {
                                entertainment: Math.round(Number(formData.entertainment || 0) * getRandomVariation()),
                                shopping: Math.round(Number(formData.shopping || 0) * getRandomVariation()),
                                diningOut: Math.round(Number(formData.diningOut || 0) * getRandomVariation()),
                                personalCare: Math.round(Number(formData.personalCare || 0) * getRandomVariation()),
                                gymMembership: Math.round(Number(formData.gymMembership || 0) * getRandomVariation()),
                                subscriptions: Math.round(Number(formData.subscriptions || 0) * getRandomVariation()),
                                travel: Math.round(Number(formData.travel || 0) * getRandomVariation()),
                                charity: Math.round(Number(formData.charity || 0) * getRandomVariation())
                              };

                              // Generate variations for savings categories
                              const savingsDetails = {
                                emergencyFund: Math.round(Number(formData.emergencyFund) * getRandomVariation()),
                                sinkingFund: Math.round(Number(formData.sinkingFund) * getRandomVariation()),
                                goalFund: Math.round(Number(formData.goalFund) * getRandomVariation())
                              };
                              
                              // Calculate totals
                              const totalNeeds = Object.values(needsDetails).reduce((sum, val) => sum + val, 0);
                              const totalWants = Object.values(wantsDetails).reduce((sum, val) => sum + val, 0);
                              const totalSavings = Object.values(savingsDetails).reduce((sum, val) => sum + val, 0);
                              
                              return {
                                income,
                                needs: totalNeeds,
                                wants: totalWants,
                                savings: income - totalNeeds - totalWants,
                                needsDetails,
                                wantsDetails,
                                savingsDetails
                              };
                            });
                            
                            newFormData.monthlyProjections = monthlyProjections;
                            
                            // Random selection for wants reduction question
                            newFormData.canReduceWants = Math.random() > 0.5 ? 'yes' : 'no';
                            
                            console.log('[Dev] Generated random projections:', monthlyProjections);
                          }
                          
                          setFormData(newFormData);
                          console.log(`[Dev] Generated random data for ${questions[currentStep].category}:`, newFormData);
                        }}
                        className="bt-dev-button"
                      >
                        🎲 Generate Random Data for {questions[currentStep].category}
                        <br />
                        <small style={{ opacity: 0.7 }}>Using realistic ranges for each field type</small>
                      </button>
                    </div>
                  )}
                  
                  <h2 className="text-2xl mb-6 text-white">
                    {questions[currentStep].category}
                  </h2>
                  
                  {questions[currentStep].description && (
                    typeof questions[currentStep].description === 'function'
                      ? questions[currentStep].description(formData)
                      : <div>{questions[currentStep].description}</div>
                  )}
                  
                  {questions[currentStep].questions.map((question, index) => {
                    if (question.showIf && !question.showIf(formData)) {
                      return null;
                    }

                    return (
                      <div key={index} className="mb-6">
                        {renderQuestion(question)}
                      </div>
                    );
                  })}

                  {questions[currentStep].renderCustomContent && 
                    questions[currentStep].renderCustomContent(formData, setFormData)
                  }
                </>
              ) : (
                <div className="bt-spreadsheet-step">
                  <h2 className="text-2xl mb-6 text-white">Your Budget Spreadsheet</h2>
                  <p className="text-lg leading-relaxed text-[#cccccc] mb-8 text-center">
                    Review your complete budget information in the spreadsheet below.
                    You can download it at any time using the button below.
                  </p>
                  <BudgetSpreadsheet formData={formData} />
                </div>
              )}
            </div>

            <div className="flex justify-between gap-4 flex-wrap">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === -1}
                className="border-white/20 bg-transparent text-white hover:bg-white/10 disabled:opacity-50"
              >
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsConfirmModalOpen(true)}
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  Return to Select
                </Button>
                <Button
                  onClick={currentStep === questions.length ? handleDownloadSpreadsheet : handleNext}
                  className="bg-gradient-to-br from-[#4CAF50] to-[#2196F3] text-white hover:opacity-90"
                >
                  {currentStep === questions.length ? 'Download Spreadsheet' : 'Next'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <SpreadsheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => navigate('/select')}
      />
    </div>
  );
};

export default BudgetTool; 