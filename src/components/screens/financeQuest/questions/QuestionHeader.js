import React from 'react';

const QuestionHeader = () => {
  return (
    <>
      <div className="w-screen bg-[#0D0021] flex flex-row items-center justify-between min-h-20 relative z-10 m-0 p-0 border-b-4 border-[#3E0B6E40]">
        <img
          src="/logo/WhiteLogo.png"
          alt="LifeSmart Logo"
          className="max-h-12 ml-8 mt-2 mb-2 max-[600px]:max-h-8 max-[600px]:ml-2"
        />
        <div className="font-['Press_Start_2P','VT323','Consolas',monospace] text-white text-[2rem] mr-12 tracking-[2px] max-[600px]:text-[1.1rem] max-[600px]:mr-3" style={{ textShadow: '0 2px 0 #000, 0 0 8px #fff2' }}>FINANCE QUEST</div>
      </div>
    </>
  );
};

export default QuestionHeader;
