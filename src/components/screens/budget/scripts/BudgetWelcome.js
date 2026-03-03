import React from 'react';
import { Button } from '@/components/ui/button';

const BudgetWelcome = ({ onNext }) => {
  return (
    <div className="flex justify-center items-center min-h-[60vh] p-8">
      <div className="bt-welcome-content text-center max-w-[600px] p-8 rounded-xl backdrop-blur-[10px] bt-content shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <h1 className="bt-welcome-title text-4xl text-white font-semibold mb-6">Welcome to your Wealth Map</h1>
        <p className="bt-welcome-message text-xl text-[#e0e0e0] mb-8 leading-relaxed">
          In the next few minutes we'll organise your numbers and show a clear path to your goals.
        </p>
        <Button
          onClick={onNext}
          className="bg-gradient-to-br from-[#4CAF50] to-[#2196F3] text-white hover:opacity-90 hover:-translate-y-0.5 transition-all"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default BudgetWelcome; 