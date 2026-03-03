import React from 'react';
import ExcelJS from 'exceljs';

// Define categories at component level
const needsCategories = [
  { label: "Housing cost (rent / mortgage)", key: "housingPayment" },
  { label: "Utilities", key: "utilities" },
  { label: "Essential groceries", key: "groceries" },
  { label: "Transport", key: "transportation" },
  { label: "Health costs", key: "healthInsurance" }
];

const wantsCategories = [
  { label: "Subscriptions", key: "subscriptions" },
  { label: "Takeaway/eating out", key: "diningOut" },
  { label: "Gym and sport", key: "gymMembership" },
  { label: "Shopping", key: "shopping" },
  { label: "Entertainment (events and activities)", key: "entertainment" },
  { label: "Gifts, charity and other", key: "charity" }
];

// Create downloadSpreadsheet as a standalone function
export const downloadSpreadsheet = async (formData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Budget Projection');

  // Set column widths
  worksheet.columns = [
    { header: 'Category', key: 'category', width: 40 },
    ...Array(12).fill(null).map(() => ({ width: 20 }))
  ];

  // Helper function to get the predicted value for a specific field and month
  const getPredictedValue = (monthIndex, category, subcategory = null) => {
    const monthData = formData.monthlyProjections[monthIndex] || {};
    
    if (subcategory) {
      if (category === 'needs') {
        // Special handling for loan payments
        if (subcategory === 'otherLoanPayment') {
          return monthData.needsDetails?.loanPayments || formData.otherLoanPayment || 0;
        }
        return monthData.needsDetails?.[subcategory] || formData[subcategory] || 0;
      } else if (category === 'wants') {
        return monthData.wantsDetails?.[subcategory] || formData[subcategory] || 0;
      } else if (category === 'savings') {
        return monthData.savingsDetails?.[subcategory] || formData[subcategory] || 0;
      }
    }
    return monthData[category] || 0;
  };

  // Helper function to calculate totals for each category
  const calculateTotals = (monthIndex) => {
    const needs = needsCategories.reduce((total, { key }) => 
      total + Number(getPredictedValue(monthIndex, 'needs', key) || 0), 0);
    
    const wants = wantsCategories.reduce((total, { key }) => 
      total + Number(getPredictedValue(monthIndex, 'wants', key) || 0), 0);
    
    const income = Number(formData.monthlyProjections[monthIndex]?.income || formData.monthlyIncome || 0);
    const fundsRemaining = income - needs - wants;
    
    const distribution = {
      needs: (needs / income) * 100 || 0,
      wants: (wants / income) * 100 || 0,
      remaining: (fundsRemaining / income) * 100 || 0
    };

    return {
      needs,
      wants,
      income,
      fundsRemaining,
      distribution
    };
  };

  const getNextMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(nextMonth.toLocaleString('default', { month: 'long' }));
    }
    return months;
  };

  const months = getNextMonths();

  // Add headers
  const headerRow = worksheet.addRow(['Category']);
  months.forEach(month => {
    headerRow.getCell(headerRow.cellCount + 1).value = `${month} (Predicted)`;
    headerRow.getCell(headerRow.cellCount + 1).value = `${month} (Actual)`;
  });

  // Style header row
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
  });

  // Helper function to add a section header
  const addSectionHeader = (title) => {
    const row = worksheet.addRow([title]);
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB8CCE4' }
    };
    row.font = { bold: true };
    worksheet.mergeCells(`A${row.number}:M${row.number}`);
  };

  // Helper function to add data rows
  const addDataRow = (label, values) => {
    const row = worksheet.addRow([label, ...values]);
    row.eachCell((cell, colNumber) => {
      if (colNumber > 1) { // Skip the label column
        cell.numFmt = '£#,##0.00';
      }
    });
    return row;
  };

  // INCOME SECTION
  addSectionHeader('TOTAL INCOME');
  
  // Salary row (only monthly income)
  const salaryValues = [];
  months.forEach((_, index) => {
    salaryValues.push(Number(formData.monthlyIncome || 0), null); // null for actual
  });
  addDataRow('Salary', salaryValues);

  // Other income row (only additional income)
  const otherValues = [];
  months.forEach((_, index) => {
    otherValues.push(Number(formData.additionalIncome || 0), null);
  });
  addDataRow('Other', otherValues);

  // NEEDS SECTION
  addSectionHeader("TOTAL 'NEEDS' SPENDING");
  needsCategories.forEach(({ label, key }) => {
    const values = [];
    months.forEach((_, index) => {
      values.push(
        getPredictedValue(index, 'needs', key),
        null
      );
    });
    addDataRow(label, values);
  });

  // WANTS SECTION
  addSectionHeader("TOTAL 'WANTS' SPENDING");
  wantsCategories.forEach(({ label, key }) => {
    const values = [];
    months.forEach((_, index) => {
      values.push(
        getPredictedValue(index, 'wants', key),
        null
      );
    });
    addDataRow(label, values);
  });

  // FUNDS REMAINING
  addSectionHeader('Funds remaining');
  const fundsRemainingValues = [];
  months.forEach((_, index) => {
    const totals = calculateTotals(index);
    fundsRemainingValues.push(totals.fundsRemaining, null);
  });
  addDataRow('Funds remaining', fundsRemainingValues);

  // DISTRIBUTION SECTION
  addSectionHeader('Distribution');
  const distributionCategories = [
    { label: "Needs %", key: "needs" },
    { label: "Wants %", key: "wants" },
    { label: "Remaining %", key: "remaining" }
  ];

  distributionCategories.forEach(({ label, key }) => {
    const values = [];
    months.forEach((_, index) => {
      const totals = calculateTotals(index);
      values.push(
        totals.distribution[key].toFixed(1) + '%',
        null
      );
    });
    addDataRow(label, values);
  });

  // FUND BALANCES
  addSectionHeader('Fund Balances');
  const balanceValues = [];
  months.forEach((_, index) => {
    // Start with initial savings
    let cumulativeBalance = Number(formData.totalSavings || 0);
    
    // Add up all funds remaining from previous months
    for (let i = 0; i <= index; i++) {
      const totals = calculateTotals(i);
      cumulativeBalance += totals.fundsRemaining;
    }
    
    balanceValues.push(cumulativeBalance, null);
  });
  addDataRow('Total Savings balance', balanceValues);

  // Apply borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Auto-filter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headerRow.cellCount }
  };

  // Generate the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', '6_month_budget_projection.xlsx');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const BudgetSpreadsheet = ({ formData }) => {
  const handleDownload = () => {
    downloadSpreadsheet(formData);
  };

  const formatCurrency = (value) => {
    const cleanValue = String(value || 0).replace(/[£\u00A0]/g, '').trim();
    const num = Number(cleanValue);
    if (num === 0) return '';
    return `£${num.toFixed(2)}`;
  };

  const getNextMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(nextMonth.toLocaleString('default', { month: 'long' }));
    }
    return months;
  };

  const getPredictedValue = (monthIndex, category, subcategory = null) => {
    const monthData = formData.monthlyProjections[monthIndex] || {};
    
    if (subcategory) {
      if (category === 'needs') {
        // Special handling for loan payments
        if (subcategory === 'otherLoanPayment') {
          return monthData.needsDetails?.loanPayments || formData.otherLoanPayment || 0;
        }
        return monthData.needsDetails?.[subcategory] || formData[subcategory] || 0;
      } else if (category === 'wants') {
        return monthData.wantsDetails?.[subcategory] || formData[subcategory] || 0;
      } else if (category === 'savings') {
        return monthData.savingsDetails?.[subcategory] || formData[subcategory] || 0;
      }
    }
    return monthData[category] || 0;
  };

  const calculateTotals = (monthIndex) => {
    const needs = needsCategories.reduce((total, { key }) => 
      total + Number(getPredictedValue(monthIndex, 'needs', key) || 0), 0);
    
    const wants = wantsCategories.reduce((total, { key }) => 
      total + Number(getPredictedValue(monthIndex, 'wants', key) || 0), 0);
    
    const income = Number(formData.monthlyProjections[monthIndex]?.income || formData.monthlyIncome || 0);
    const fundsRemaining = income - needs - wants;
    
    const distribution = {
      needs: (needs / income) * 100 || 0,
      wants: (wants / income) * 100 || 0,
      remaining: (fundsRemaining / income) * 100 || 0
    };

    return {
      needs,
      wants,
      income,
      fundsRemaining,
      distribution
    };
  };

  const months = getNextMonths();

  return (
    <div className="budgetspreadsheet-container">
      <div className="budgetspreadsheet-content">
        <header className="budgetspreadsheet-header">
          <h1>6-Month Budget Projection</h1>
          <p>Track your finances across the next 6 months</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button 
              className="budgettool-button budgettool-button-primary"
              onClick={handleDownload}
            >
              Download Excel Spreadsheet
            </button>
          </div>
        </header>

        <div className="budgetspreadsheet-table-wrapper">
          <table className="budgetspreadsheet-table">
            <colgroup>
              <col style={{ width: '250px' }} /> {/* Category column */}
              {months.map((_, index) => (
                <React.Fragment key={index}>
                  <col style={{ width: '120px' }} /> {/* Predicted column */}
                  <col style={{ width: '120px' }} /> {/* Actual column */}
                </React.Fragment>
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="fixed-column">Category</th>
                {months.map((month, index) => (
                  <th key={index}>
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* INCOME SECTION */}
              <tr className="section-header">
                <td colSpan={7}>
                  TOTAL INCOME: {formatCurrency(Number(formData.monthlyIncome || 0) + Number(formData.additionalIncome || 0))}
                </td>
              </tr>
              <tr>
                <td className="fixed-column">Salary</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(Number(formData.monthlyIncome || 0))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Other</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(Number(formData.additionalIncome || 0))}</td>
                ))}
              </tr>

              {/* NEEDS SECTION */}
              <tr className="section-header">
                <td colSpan={7}>
                  TOTAL "NEEDS" SPENDING: {formatCurrency(needsCategories.reduce((total, { key }) => 
                    total + Number(getPredictedValue(0, 'needs', key) || 0), 0))}
                </td>
              </tr>
              <tr>
                <td className="fixed-column">Housing cost (rent / mortgage)</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'needs', 'housingPayment'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Bills (utilities, bills, internet)</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'needs', 'utilities'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Transport</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'needs', 'transportation'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Groceries (basic)</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'needs', 'groceries'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Health costs</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'needs', 'healthInsurance'))}</td>
                ))}
              </tr>

              {/* WANTS SECTION */}
              <tr className="section-header">
                <td colSpan={7}>
                  TOTAL "WANTS" SPENDING: {formatCurrency(wantsCategories.reduce((total, { key }) => 
                    total + Number(getPredictedValue(0, 'wants', key) || 0), 0))}
                </td>
              </tr>
              <tr>
                <td className="fixed-column">Subscriptions</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'wants', 'subscriptions'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Takeaway/eating out</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'wants', 'diningOut'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Gym and sport</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'wants', 'gymMembership'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Shopping</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'wants', 'shopping'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Entertainment (events and activities)</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'wants', 'entertainment'))}</td>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Gifts, charity and other</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'wants', 'charity'))}</td>
                ))}
              </tr>

              {/* FUNDS REMAINING */}
              <tr className="section-header">
                <td colSpan={7}>Funds remaining</td>
              </tr>
              <tr>
                <td className="fixed-column">Funds remaining</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <td key={index}>{formatCurrency(totals.fundsRemaining)}</td>
                  );
                })}
              </tr>

              {/* DISTRIBUTION SECTION */}
              <tr className="section-header">
                <td colSpan={7}>Distribution</td>
              </tr>
              <tr>
                <td className="fixed-column">Needs %</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <td key={index}>{totals.distribution.needs.toFixed(1)}%</td>
                  );
                })}
              </tr>
              <tr>
                <td className="fixed-column">Wants %</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <td key={index}>{totals.distribution.wants.toFixed(1)}%</td>
                  );
                })}
              </tr>
              <tr>
                <td className="fixed-column">Remaining %</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <td key={index}>{totals.distribution.remaining.toFixed(1)}%</td>
                  );
                })}
              </tr>

              {/* FUND BALANCES */}
              <tr className="section-header">
                <td colSpan={7}>Fund Balances</td>
              </tr>
              <tr>
                <td className="fixed-column">Total Savings balance</td>
                {months.map((_, index) => {
                  // Start with initial savings
                  let cumulativeBalance = Number(formData.totalSavings || 0);
                  
                  // Add up all funds remaining from previous months
                  for (let i = 0; i <= index; i++) {
                    const totals = calculateTotals(i);
                    cumulativeBalance += totals.fundsRemaining;
                  }
                  
                  return (
                    <td key={index}>{formatCurrency(cumulativeBalance)}</td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetSpreadsheet; 