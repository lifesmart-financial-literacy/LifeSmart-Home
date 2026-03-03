import React from 'react';

const BudgetWelcome = ({ onNext }) => {
  return (
    <div className="budgettool-welcome">
      <div className="budgettool-welcome-content">
        <h1 className="budgettool-welcome-title">Welcome to your Wealth Map</h1>
        <p className="budgettool-welcome-message">
          In the next few minutes we'll organise your numbers and show a clear path to your goals.
        </p>
        <button 
          onClick={onNext}
          className="budgettool-button budgettool-button-primary"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default BudgetWelcome; 