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
    <div className="bt-modal-overlay">
      <div className="bt-modal-content w-full max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-[20px] p-8 shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[1.8rem] text-white m-0">Budget Overview</h2>
          <button onClick={onClose} className="bt-modal-close bg-transparent border-none text-white text-3xl cursor-pointer p-2 leading-none opacity-70 hover:opacity-100 transition-opacity rounded">&times;</button>
        </div>
        
        <div className="bt-modal-body text-white">
          {/* Income Information */}
          <div className="bt-modal-section mb-8">
            <h3 className="text-[1.4rem] mb-6 text-white">Income Information</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Monthly Income:</span>
                <span>{formatCurrency(formData.monthlyIncome)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Additional Income:</span>
                <span>{formatCurrency(formData.additionalIncome)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Total Income:</span>
                <span>{formatCurrency(summary.totalIncome)}</span>
              </div>
            </div>
          </div>

          {/* Housing Expenses */}
          <div className="bt-modal-section mb-8">
            <h3>Housing Expenses</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>{getHousingPaymentLabel()}:</span>
                <span>{formatCurrency(housingPayment)}</span>
              </div>
              {formData.housingType === 'mortgage' && (
                <>
                  <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                    <span>Property Tax:</span>
                    <span>{formatCurrency(formData.propertyTax)}</span>
                  </div>
                  <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                    <span>Home Insurance:</span>
                    <span>{formatCurrency(formData.homeInsurance)}</span>
                  </div>
                </>
              )}
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Utilities:</span>
                <span>{formatCurrency(formData.utilities)}</span>
              </div>
            </div>
          </div>

          {/* Transportation */}
          <div className="bt-modal-section mb-8">
            <h3>Transportation</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Transportation Expenses:</span>
                <span>{formatCurrency(formData.transportation)}</span>
              </div>
            </div>
          </div>

          {/* Food & Dining */}
          <div className="bt-modal-section mb-8">
            <h3>Food & Dining</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Groceries:</span>
                <span>{formatCurrency(formData.groceries)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Dining Out:</span>
                <span>{formatCurrency(formData.diningOut)}</span>
              </div>
            </div>
          </div>

          {/* Personal Care */}
          <div className="bt-modal-section mb-8">
            <h3>Personal Care</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Health costs:</span>
                <span>{formatCurrency(formData.healthInsurance)}</span>
              </div>
            </div>
          </div>

          {/* Entertainment & Leisure */}
          <div className="bt-modal-section mb-8">
            <h3>Entertainment & Leisure</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Entertainment:</span>
                <span>{formatCurrency(formData.entertainment)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Shopping:</span>
                <span>{formatCurrency(formData.shopping)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Subscriptions:</span>
                <span>{formatCurrency(formData.subscriptions)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Personal Care Budget:</span>
                <span>{formatCurrency(formData.personalCareBudget)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Travel:</span>
                <span>{formatCurrency(formData.travel)}</span>
              </div>
            </div>
          </div>

          {/* Savings Information */}
          <div className="bt-modal-section mb-8">
            <h3>Savings Information</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Has Savings Pot:</span>
                <span>{formData.hasSavingsPot === 'yes' ? 'Yes' : 'No'}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Savings Pot Type:</span>
                <span>{formData.savingsPotType || 'Not specified'}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Emergency Fund:</span>
                <span>{formatCurrency(formData.emergencyFund)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Sinking Fund:</span>
                <span>{formatCurrency(formData.sinkingFund)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Goal/Investment Fund:</span>
                <span>{formatCurrency(formData.goalFund)}</span>
              </div>
            </div>
          </div>

          {/* Current Budget Summary */}
          <div className="bt-modal-section mb-8">
            <h3>Current Budget Summary</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Total Income:</span>
                <span>{formatCurrency(summary.totalIncome)}</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Needs:</span>
                <span>{formatCurrency(summary.needs)} ({summary.needsPercentage.toFixed(1)}%)</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Wants:</span>
                <span>{formatCurrency(summary.wants)} ({summary.wantsPercentage.toFixed(1)}%)</span>
              </div>
              <div className="bt-modal-item bg-white/5 p-4 rounded-lg flex flex-col gap-2">
                <span>Available for Savings:</span>
                <span>{formatCurrency(summary.savings)} ({summary.remainingPercentage.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          {/* 6-Month Projection */}
          {formData.monthlyProjections && formData.monthlyProjections.length > 0 && (
            <div className="bt-modal-section mb-8">
              <h3>6-Month Projection</h3>
              <div className="bt-modal-table w-full overflow-x-auto bg-white/5 rounded-xl p-4">
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