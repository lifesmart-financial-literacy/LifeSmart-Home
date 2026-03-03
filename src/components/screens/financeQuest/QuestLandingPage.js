import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuestLandingPage = () => {
  const navigate = useNavigate();
  const handlePressStart = () => {
    navigate('/finance-quest-team-creation');
  };

  return (
    <div className="fq-landing-bg min-h-screen w-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating pixel icons */}
      <img src="/financeQuest/icons/8bitCalculatorWithCoin.png" alt="Calculator" className="fq-landing-icon fq-landing-icon-calc" />
      <img src="/financeQuest/icons/8bitRocket.png" alt="Rocket" className="fq-landing-icon fq-landing-icon-rocket" />
      <img src="/financeQuest/icons/8bitGreenCash.png" alt="Cash" className="fq-landing-icon fq-landing-icon-cash" />
      <img src="/financeQuest/icons/8bitCashBag.png" alt="Coin" className="fq-landing-icon fq-landing-icon-coin1" />
      <img src="/financeQuest/icons/8bitCreditCard.png" alt="Coin" className="fq-landing-icon fq-landing-icon-coin2" />
      <div className="flex flex-col items-center z-[2]">
        <img src="/financeQuest/icons/8bitPigWithCoin.png" alt="Piggy Bank" className="block mx-auto mb-6 w-[140px] h-auto z-[2] md:w-[140px] max-[700px]:w-[45px] max-[700px]:mb-4" />
        <div className="font-['Press_Start_2P',monospace] text-[#a97fff] text-xl mb-6 tracking-[2px] text-center">WELCOME TO</div>
        <div className="font-['Press_Start_2P',monospace] text-[#ffd43b] text-[3rem] tracking-[4px] mb-6 text-center leading-tight max-[700px]:text-[2rem]" style={{ textShadow: '4px 4px 0 #2d1a4d, 0 0 8px #000' }}>FINANCE QUEST</div>
        <div className="font-['Press_Start_2P',monospace] text-white text-[0.9rem] text-center mb-10 max-w-[600px] leading-[1.7] max-[700px]:text-[0.7rem] max-[700px]:max-w-[90vw]">
          Launch your financial future as you explore <b>CREDIT, LOANS, SAVINGS, AND INVESTMENTS</b><br />
          all while building your money smartly.
        </div>
        <button className="fq-press-start-btn w-[320px] h-20 flex items-center justify-center cursor-pointer mt-6 text-white font-['Press_Start_2P',monospace] text-[1.1rem] border-none transition-[filter_0.15s,transform_0.1s] max-[700px]:text-[0.8rem] max-[700px]:py-[0.7rem] max-[700px]:px-6" onClick={handlePressStart}>
        </button>
      </div>
    </div>
  );
};

export default QuestLandingPage;
