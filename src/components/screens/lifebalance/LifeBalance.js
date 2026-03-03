import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import LifeBalanceHeader from './components/LifeBalanceHeader';

const LIFE_AREAS = [
  'Health & Well-being',
  'Family & Connections',
  'Career & Income',
  'Lifestyle, Spending & Fun',
  'Housing, Safety & Security',
  'Giving & Contribution',
  'Personal Growth & Purpose',
];

const LifeBalance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [baseScores, setBaseScores] = useState([]);
  const [cashScores, setCashScores] = useState([]);
  const [timeScores, setTimeScores] = useState([]);
  const [page2Step, setPage2Step] = useState(1);
  const [page3Step, setPage3Step] = useState(1);
  const [page4Step, setPage4Step] = useState(1);
  const navigate = useNavigate();

  const handleWelcomeNext = () => setCurrentPage(2);
  const handlePage2Submit = (scores) => {
    setBaseScores(scores);
    setCurrentPage(3);
  };
  const handlePage3Submit = (scores) => {
    setCashScores(scores);
    setCurrentPage(4);
  };
  const handlePage4Submit = (scores) => {
    setTimeScores(scores);
    setCurrentPage(5);
  };
  const handlePage5Submit = () => navigate('/');

  const avg = (arr) => (arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '-');
  const averages = { now: avg(baseScores), money: avg(cashScores), time: avg(timeScores) };

  let biggestMoney = { area: '', value: 0 };
  let biggestTime = { area: '', value: 0 };
  if (baseScores.length && cashScores.length) {
    let maxDiff = -Infinity;
    LIFE_AREAS.forEach((area, i) => {
      const diff = cashScores[i] - baseScores[i];
      if (diff > maxDiff) {
        maxDiff = diff;
        biggestMoney = { area, value: +(diff.toFixed(1)) };
      }
    });
  }
  if (baseScores.length && timeScores.length) {
    let maxDiff = -Infinity;
    LIFE_AREAS.forEach((area, i) => {
      const diff = timeScores[i] - baseScores[i];
      if (diff > maxDiff) {
        maxDiff = diff;
        biggestTime = { area, value: +(diff.toFixed(1)) };
      }
    });
  }

  const moneyActions = {
    'Housing, Safety & Security': 'Build or top-up an emergency fund (3-6 months expenses) or pay down high-interest debt. This single move reduces financial anxiety quickly.',
  };
  const timeActions = {
    'Family & Connections': 'Schedule a weekly device-free meal or call with loved ones. Consistency matters more than extravagant plans.',
  };
  biggestMoney.action = moneyActions[biggestMoney.area] || '';
  biggestTime.action = timeActions[biggestTime.area] || '';

  let currentStep = 1;
  const totalSteps = 7;
  if (currentPage === 2) currentStep = page2Step;
  else if (currentPage === 3) currentStep = page3Step;
  else if (currentPage === 4) currentStep = page4Step;
  else if (currentPage === 5) currentStep = 7;

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return <WelcomePage onNext={handleWelcomeNext} />;
      case 2:
        return <Page2 onSubmit={handlePage2Submit} onStepChange={setPage2Step} />;
      case 3:
        return <Page3 baseScores={baseScores} onSubmit={handlePage3Submit} onStepChange={setPage3Step} />;
      case 4:
        return <Page4 baseScores={baseScores} onFinish={handlePage4Submit} onStepChange={setPage4Step} />;
      case 5:
        return <Page5 averages={averages} biggestMoney={biggestMoney} biggestTime={biggestTime} onSubmit={handlePage5Submit} />;
      default:
        return <WelcomePage onNext={handleWelcomeNext} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center pt-8 bg-[radial-gradient(70.76%_70.76%_at_44.55%_9.17%,#21203D_0%,#13112F_31.23%,#110F29_41.06%,#0D0C20_59.28%,#000_100%)]">
      <LifeBalanceHeader currentStep={currentStep} totalSteps={totalSteps} />
      <div className="w-full p-4 md:p-8 md:m-4">{renderPage()}</div>
    </div>
  );
};

export default LifeBalance;
