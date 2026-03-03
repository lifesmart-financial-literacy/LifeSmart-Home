import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuestLandingPage = () => {
  const navigate = useNavigate();
  const handlePressStart = () => {
    navigate('/finance-quest-team-creation');
  };

  return (
    <div className="financeQuest-landingPage-background">
      {/* Floating pixel icons */}
      <img src="/financeQuest/icons/8bitCalculatorWithCoin.png" alt="Calculator" className="financeQuest-landingPage-icon financeQuest-landingPage-icon-calculator" />
      <img src="/financeQuest/icons/8bitRocket.png" alt="Rocket" className="financeQuest-landingPage-icon financeQuest-landingPage-icon-rocket" />
      <img src="/financeQuest/icons/8bitGreenCash.png" alt="Cash" className="financeQuest-landingPage-icon financeQuest-landingPage-icon-cash" />
      <img src="/financeQuest/icons/8bitCashBag.png" alt="Coin" className="financeQuest-landingPage-icon financeQuest-landingPage-icon-coin1" />
      <img src="/financeQuest/icons/8bitCreditCard.png" alt="Coin" className="financeQuest-landingPage-icon financeQuest-landingPage-icon-coin2" />
      <div className="financeQuest-landingPage-content">
        <img src="/financeQuest/icons/8bitPigWithCoin.png" alt="Piggy Bank" className="financeQuest-landingPage-piggy-above" />
        <div className="financeQuest-landingPage-welcome">WELCOME TO</div>
        <div className="financeQuest-landingPage-title">FINANCE QUEST</div>
        <div className="financeQuest-landingPage-subtitle">
          Launch your financial future as you explore <b>CREDIT, LOANS, SAVINGS, AND INVESTMENTS</b><br />
          all while building your money smartly.
        </div>
        <button className="financeQuest-landingPage-pressStart" onClick={handlePressStart}>
        </button>
      </div>
    </div>
  );
};

export default QuestLandingPage;
