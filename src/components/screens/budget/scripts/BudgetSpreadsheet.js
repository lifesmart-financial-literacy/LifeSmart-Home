import React from 'react';
import ExcelJS from 'exceljs';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen p-8 md:p-4 bg-[#393939] rounded-xl">
      <div className="max-w-[1200px] mx-auto bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] py-10 px-8">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-[2rem] text-slate-800 mb-2">6-Month Budget Projection</h1>
          <p className="text-slate-500 text-base">Track your finances across the next 6 months</p>
          <div className="mt-4 flex justify-center items-center">
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-br from-[#4CAF50] to-[#2196F3] text-white hover:opacity-90"
            >
              Download Excel Spreadsheet
            </Button>
          </div>
        </header>

        <div className="overflow-x-auto mb-8 border border-slate-200 rounded-md w-full">
          <table className="w-full min-w-[1200px] border-collapse text-[0.95rem]">
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
                <th className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200">Category</th>
                {months.map((month, index) => (
                  <th key={index} className="sticky top-0 bg-slate-100 font-semibold text-slate-800 py-3 px-4 text-right border border-slate-200 z-10">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* INCOME SECTION */}
              <tr className="bg-blue-100 font-bold text-slate-900">
                <td colSpan={7} className="text-left pl-4 py-3 border border-slate-200">
                  TOTAL INCOME: {formatCurrency(Number(formData.monthlyIncome || 0) + Number(formData.additionalIncome || 0))}
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200">Salary</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(Number(formData.monthlyIncome || 0))}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200">Other</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(Number(formData.additionalIncome || 0))}</td>
                ))}
              </tr>

              {/* NEEDS SECTION */}
              <tr className="bg-blue-100 font-bold text-slate-900">
                <td colSpan={7} className="text-left pl-4 py-3 border border-slate-200">
                  TOTAL "NEEDS" SPENDING: {formatCurrency(needsCategories.reduce((total, { key }) => 
                    total + Number(getPredictedValue(0, 'needs', key) || 0), 0))}
                </td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Housing cost (rent / mortgage)</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'needs', 'housingPayment'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Bills (utilities, bills, internet)</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'needs', 'utilities'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Transport</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'needs', 'transportation'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Groceries (basic)</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'needs', 'groceries'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Health costs</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'needs', 'healthInsurance'))}</td>
                ))}
              </tr>

              {/* WANTS SECTION */}
              <tr className="bg-blue-100 font-bold text-slate-900">
                <td colSpan={7} className="text-left pl-4 py-3 border border-slate-200">
                  TOTAL "WANTS" SPENDING: {formatCurrency(wantsCategories.reduce((total, { key }) => 
                    total + Number(getPredictedValue(0, 'wants', key) || 0), 0))}
                </td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Subscriptions</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'wants', 'subscriptions'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Takeaway/eating out</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'wants', 'diningOut'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Gym and sport</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'wants', 'gymMembership'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Shopping</td>
                {months.map((_, index) => (
                  <td key={index}>{formatCurrency(getPredictedValue(index, 'wants', 'shopping'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Entertainment (events and activities)</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'wants', 'entertainment'))}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Gifts, charity and other</td>
                {months.map((_, index) => (
                  <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(getPredictedValue(index, 'wants', 'charity'))}</td>
                ))}
              </tr>

              {/* FUNDS REMAINING */}
              <tr className="bg-blue-100 font-bold text-slate-900">
                <td colSpan={7} className="text-left pl-4 py-3 border border-slate-200">Funds remaining</td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Funds remaining</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(totals.fundsRemaining)}</td>
                  );
                })}
              </tr>

              {/* DISTRIBUTION SECTION */}
              <tr className="bg-blue-100 font-bold text-slate-900">
                <td colSpan={7} className="text-left pl-4 py-3 border border-slate-200">Distribution</td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Needs %</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{totals.distribution.needs.toFixed(1)}%</td>
                  );
                })}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Wants %</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{totals.distribution.wants.toFixed(1)}%</td>
                  );
                })}
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Remaining %</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{totals.distribution.remaining.toFixed(1)}%</td>
                  );
                })}
              </tr>

              {/* FUND BALANCES */}
              <tr className="bg-blue-100 font-bold text-slate-900">
                <td colSpan={7} className="text-left pl-4 py-3 border border-slate-200">Fund Balances</td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-slate-200 z-[5] text-left font-medium text-slate-800 py-3 px-4 border border-slate-200 hover:bg-slate-100">Total Savings balance</td>
                {months.map((_, index) => {
                  // Start with initial savings
                  let cumulativeBalance = Number(formData.totalSavings || 0);
                  
                  // Add up all funds remaining from previous months
                  for (let i = 0; i <= index; i++) {
                    const totals = calculateTotals(i);
                    cumulativeBalance += totals.fundsRemaining;
                  }
                  
                  return (
                    <td key={index} className="py-3 px-4 text-right border border-slate-200 text-slate-800">{formatCurrency(cumulativeBalance)}</td>
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