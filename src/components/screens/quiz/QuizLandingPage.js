import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import piggyBankIcon from '../../../assets/icons/piggy_bank.png';
import dollarTreeIcon from '../../../assets/icons/dollar_tree.png';
import chartIcon from '../../../assets/icons/chart.png';
import cardIcon from '../../../assets/icons/card.png';
import moneyIcon from '../../../assets/icons/money.png';
import seedIcon from '../../../assets/icons/seed.png';
import graduateIcon from '../../../assets/icons/graduate.png';

const QuizLandingPage = () => {
  const navigate = useNavigate();
  const [showTeamCreation, setShowTeamCreation] = useState(false);
  const [teamCount, setTeamCount] = useState(1);
  const [teams, setTeams] = useState(Array(1).fill(''));
  const maxTeams = 10000;

  const startTeamCreation = () => setShowTeamCreation(true);

  const increaseTeams = () => {
    if (teamCount < maxTeams) {
      setTeamCount((prev) => prev + 1);
      setTeams((prev) => [...prev, '']);
    }
  };

  const decreaseTeams = () => {
    if (teamCount > 1) {
      setTeamCount((prev) => prev - 1);
      setTeams((prev) => prev.slice(0, -1));
    }
  };

  const handleTeamNameChange = (index, value) => {
    setTeams((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const startQuiz = () => {
    if (teams.every((name) => name.trim())) {
      navigate({ pathname: '/quiz', search: `?teams=${teams.join(',')}` });
    }
  };

  if (!showTeamCreation) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <div className="flex flex-col justify-center items-center min-h-screen relative overflow-hidden">
          <header className="bg-transparent py-5 text-center flex flex-col gap-2.5 z-[2]">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#003F91] to-[#4CAF50] bg-clip-text text-transparent m-0 animate-[titleFadeIn_0.8s_ease-out]">Welcome to</h1>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#003F91] to-[#4CAF50] bg-clip-text text-transparent m-0 animate-[titleFadeIn_0.8s_ease-out]">The Financial Game!</h1>
          </header>
          <main className="flex flex-col items-center justify-center p-10 z-[2]">
            <p className="text-xl leading-relaxed text-[#4f4f4f] max-w-[600px] mb-8 text-center animate-[fadeIn_1s_ease-out_0.3s_both]">
              Welcome to the game that helps prepare you for your financial future. Explore concepts like credit, loans, savings, and investments while building your financial savviness.
            </p>
            <Button onClick={startTeamCreation} className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white py-4 px-10 text-2xl rounded-[30px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all">
              Start Game
            </Button>
          </main>
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <img src={piggyBankIcon} alt="Piggy Bank" className="absolute opacity-15 w-[100px] top-[10%] left-[10%] animate-[float_6s_ease-in-out_infinite]" />
            <img src={dollarTreeIcon} alt="Dollar Tree" className="absolute opacity-15 w-[120px] top-[20%] right-[15%] animate-[float_6s_ease-in-out_infinite]" />
            <img src={chartIcon} alt="Chart" className="absolute opacity-15 w-[110px] bottom-[15%] left-[20%] animate-[float_6s_ease-in-out_infinite]" />
            <img src={cardIcon} alt="Card" className="absolute opacity-15 w-[90px] top-[40%] left-1/2 -translate-x-1/2 animate-[float_6s_ease-in-out_infinite]" />
            <img src={moneyIcon} alt="Money" className="absolute opacity-15 w-[100px] bottom-[30%] right-[20%] animate-[float_6s_ease-in-out_infinite]" />
            <img src={seedIcon} alt="Seed" className="absolute opacity-15 w-[80px] top-[60%] left-[15%] animate-[float_6s_ease-in-out_infinite]" />
            <img src={graduateIcon} alt="Graduate" className="absolute opacity-15 w-[110px] bottom-[10%] right-[10%] animate-[float_6s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-10">
      <header className="bg-transparent py-5 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#003F91] to-[#4CAF50] bg-clip-text text-transparent m-0">Enter Game Details</h1>
      </header>
      <main className="flex flex-col items-center justify-center flex-1">
        <div className="flex flex-col items-center gap-8 max-w-[600px] mx-auto">
          <div className="flex flex-col items-center gap-4 w-full">
            <label htmlFor="teamCount" className="font-bold text-xl text-[#003F91]">NUMBER OF TEAMS</label>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={decreaseTeams} className="bg-gradient-to-r from-[#B8CEF0] to-[#9ab8e0] border-none rounded-xl py-2.5 px-5 text-2xl text-[#003F91] hover:scale-105 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                -
              </Button>
              <Input id="teamCount" value={teamCount} readOnly className="w-16 p-2.5 text-xl text-center border-none bg-[#B8CEF0] rounded-lg text-[#003F91] font-medium" />
              <Button variant="outline" onClick={increaseTeams} className="bg-gradient-to-r from-[#B8CEF0] to-[#9ab8e0] border-none rounded-xl py-2.5 px-5 text-2xl text-[#003F91] hover:scale-105 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                +
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label className="font-bold text-xl text-[#003F91] text-center">TEAM NAMES</label>
            {teams.map((team, index) => (
              <Input
                key={index}
                value={team}
                onChange={(e) => handleTeamNameChange(index, e.target.value)}
                placeholder="Enter team name"
                className="w-full p-3 text-base border-2 border-transparent bg-[#f5f7fa] rounded-xl focus:border-[#003F91] focus:bg-white focus:shadow-[0_4px_12px_rgba(0,63,145,0.1)]"
              />
            ))}
          </div>
          <Button
            onClick={startQuiz}
            disabled={teams.some((name) => !name.trim())}
            className="w-full max-w-[200px] mt-4 bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white py-4 px-10 text-xl rounded-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:not(:disabled):-translate-y-1 hover:not(:disabled):scale-[1.02] hover:not(:disabled):shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
};

export default QuizLandingPage;
