import React from 'react';

const LifeBalanceHeader = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-start items-center py-2 px-6 w-full max-w-[1200px] mx-auto mb-4 bg-[#19153a] rounded-[25px] border border-white/10 relative">
      <div className="flex items-center gap-2">
        <span className="text-3xl">💡</span>
        <span className="text-xl font-semibold text-white">LifeSmart</span>
      </div>
      {currentStep && totalSteps && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2c265e] text-[#d1c8ff] py-2 px-4 rounded-[15px] text-sm font-semibold">
          Q {currentStep}/{totalSteps}
        </div>
      )}
    </div>
  );
};

export default LifeBalanceHeader;
