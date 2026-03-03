import React from 'react';

const SpreadsheetModal = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  // Get housing payment based on type
  const housingPayment = formData.housingType === 'mortgage' ? Number(formData.mortgage || 0) : Number(formData.rent || 0);

  const summary = {
    // Income calculations
    totalIncome: Number(formData.monthlyIncome || 0) + Number(formData.additionalIncome || 0),
    
    // Needs calculations
    needs: (
      // Housing
      housingPayment + 
      Number(formData.utilities || 0) +
      // Essential groceries
      Number(formData.groceries || 0) +
      // Transport
      Number(formData.transportation || 0) +
      // Health costs
      Number(formData.healthInsurance || 0)
    ),
    
    // Wants calculations
    wants: (
      // Food & Dining
      Number(formData.diningOut || 0) +
      // Personal Care
      Number(formData.gymMembership || 0) + 
      Number(formData.personalCare || 0) +
      // Entertainment & Leisure
      Number(formData.entertainment || 0) + 
      Number(formData.shopping || 0) + 
      Number(formData.subscriptions || 0) + 
      Number(formData.personalCareBudget || 0) + 
      Number(formData.travel || 0)
    )
  };

  summary.needsPercentage = (summary.needs / summary.totalIncome) * 100 || 0;
  summary.wantsPercentage = (summary.wants / summary.totalIncome) * 100 || 0;
  summary.remainingPercentage = Math.max(0, 100 - summary.needsPercentage - summary.wantsPercentage);
  summary.savings = Math.max(0, summary.totalIncome - summary.needs - summary.wants);

  // Helper function to format currency
  const formatCurrency = (value) => `£${Number(value || 0).toFixed(2)}`;

  // Helper function to get housing payment label
  const getHousingPaymentLabel = () => {
    return formData.housingType === 'mortgage' ? 'Mortgage Payment' : 'Rent Payment';
  };

  return (
    <div className="budgettool-modal-overlay">
      <div className="budgettool-modal-content">
        <div className="budgettool-modal-header">
          <h2>Budget Overview</h2>
          <button onClick={onClose} className="budgettool-modal-close">&times;</button>
        </div>
        
        <div className="budgettool-modal-body">
          {/* Income Information */}
          <div className="budgettool-modal-section">
            <h3>Income Information</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Monthly Income:</span>
                <span>{formatCurrency(formData.monthlyIncome)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Additional Income:</span>
                <span>{formatCurrency(formData.additionalIncome)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Total Income:</span>
                <span>{formatCurrency(summary.totalIncome)}</span>
              </div>
            </div>
          </div>

          {/* Housing Expenses */}
          <div className="budgettool-modal-section">
            <h3>Housing Expenses</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>{getHousingPaymentLabel()}:</span>
                <span>{formatCurrency(housingPayment)}</span>
              </div>
              {formData.housingType === 'mortgage' && (
                <>
                  <div className="budgettool-modal-item">
                    <span>Property Tax:</span>
                    <span>{formatCurrency(formData.propertyTax)}</span>
                  </div>
                  <div className="budgettool-modal-item">
                    <span>Home Insurance:</span>
                    <span>{formatCurrency(formData.homeInsurance)}</span>
                  </div>
                </>
              )}
              <div className="budgettool-modal-item">
                <span>Utilities:</span>
                <span>{formatCurrency(formData.utilities)}</span>
              </div>
            </div>
          </div>

          {/* Transportation */}
          <div className="budgettool-modal-section">
            <h3>Transportation</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Transportation Expenses:</span>
                <span>{formatCurrency(formData.transportation)}</span>
              </div>
            </div>
          </div>

          {/* Food & Dining */}
          <div className="budgettool-modal-section">
            <h3>Food & Dining</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Groceries:</span>
                <span>{formatCurrency(formData.groceries)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Dining Out:</span>
                <span>{formatCurrency(formData.diningOut)}</span>
              </div>
            </div>
          </div>

          {/* Personal Care */}
          <div className="budgettool-modal-section">
            <h3>Personal Care</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Health costs:</span>
                <span>{formatCurrency(formData.healthInsurance)}</span>
              </div>
            </div>
          </div>

          {/* Entertainment & Leisure */}
          <div className="budgettool-modal-section">
            <h3>Entertainment & Leisure</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Entertainment:</span>
                <span>{formatCurrency(formData.entertainment)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Shopping:</span>
                <span>{formatCurrency(formData.shopping)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Subscriptions:</span>
                <span>{formatCurrency(formData.subscriptions)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Personal Care Budget:</span>
                <span>{formatCurrency(formData.personalCareBudget)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Travel:</span>
                <span>{formatCurrency(formData.travel)}</span>
              </div>
            </div>
          </div>

          {/* Savings Information */}
          <div className="budgettool-modal-section">
            <h3>Savings Information</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Has Savings Pot:</span>
                <span>{formData.hasSavingsPot === 'yes' ? 'Yes' : 'No'}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Savings Pot Type:</span>
                <span>{formData.savingsPotType || 'Not specified'}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Emergency Fund:</span>
                <span>{formatCurrency(formData.emergencyFund)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Sinking Fund:</span>
                <span>{formatCurrency(formData.sinkingFund)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Goal/Investment Fund:</span>
                <span>{formatCurrency(formData.goalFund)}</span>
              </div>
            </div>
          </div>

          {/* Current Budget Summary */}
          <div className="budgettool-modal-section">
            <h3>Current Budget Summary</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Total Income:</span>
                <span>{formatCurrency(summary.totalIncome)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Needs:</span>
                <span>{formatCurrency(summary.needs)} ({summary.needsPercentage.toFixed(1)}%)</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Wants:</span>
                <span>{formatCurrency(summary.wants)} ({summary.wantsPercentage.toFixed(1)}%)</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Available for Savings:</span>
                <span>{formatCurrency(summary.savings)} ({summary.remainingPercentage.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          {/* 6-Month Projection */}
          {formData.monthlyProjections && formData.monthlyProjections.length > 0 && (
            <div className="budgettool-modal-section">
              <h3>6-Month Projection</h3>
              <div className="budgettool-modal-table">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Needs</th>
                      <th>Wants</th>
                      <th>Savings</th>
                      <th>Changes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.monthlyProjections.map((month, index) => (
                      <tr key={index}>
                        <td>Month {index + 1}</td>
                        <td>{formatCurrency(month.income)}</td>
                        <td>{formatCurrency(month.needs)}</td>
                        <td>{formatCurrency(month.wants)}</td>
                        <td>{formatCurrency(month.savings)}</td>
                        <td>
                          Income: {(month.income / summary.totalIncome * 100 - 100).toFixed(1)}%<br/>
                          Needs: {(month.needs / summary.needs * 100 - 100).toFixed(1)}%<br/>
                          Wants: {(month.wants / summary.wants * 100 - 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetModal; 