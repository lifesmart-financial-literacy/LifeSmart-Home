/* eslint-disable no-unused-vars -- Icon imports reserved for future UI enhancements */
import React, { useState, useEffect } from 'react';
import { FaBook, FaSmile, FaChartLine, FaHeartbeat, FaExclamationTriangle } from 'react-icons/fa';
import potIcon from '../../../../assets/icons/piggy_bank.png';
import QuestionHeader from './QuestionHeader';

const DEV_MODE = true; // Set to false to hide dev features

const PLANET_EARTH = '/financeQuest/celestialBodies/Earth.png';
const PLANET_MOON = '/financeQuest/celestialBodies/Moon.png';
const PLANET_MARS = '/financeQuest/celestialBodies/Mars.png';

const BASE_FUNDS = 10000;
const POINTS_MULTIPLIER = 1000;

const pots = [
  {
    letter: 'A',
    name: 'Training & Self-Development Pot',
    description: 'Money for building skills and learning.',
    icon: <FaBook color="#4DD7FF" size={24} />,
    color: '#4DD7FF',
  },
  {
    letter: 'B',
    name: 'Life-Experiences & Fun Pot',
    description: 'Money for hobbies, travel, and enjoyment.',
    icon: <FaSmile color="#FF9524" size={24} />,
    color: '#FF9524',
  },
  {
    letter: 'C',
    name: 'Investment Pot',
    description: 'Money to grow wealth over time.',
    icon: <FaChartLine color="#FFD43B" size={24} />,
    color: '#FFD43B',
  },
  {
    letter: 'D',
    name: 'Health & Well-being Pot',
    description: 'Money for fitness, health, and self-care.',
    icon: <FaHeartbeat color="#CA70E3" size={24} />,
    color: '#CA70E3',
  },
  {
    letter: 'E',
    name: 'Emergency Pot',
    description: 'Money for unexpected problems.',
    icon: <FaExclamationTriangle color="#E1551D" size={24} />,
    color: '#E1551D',
  }
];

function randomAllocation() {
  // Returns {A, B, C, D, E} with values summing to 100
  let remaining = 100;
  const vals = [];
  for (let i = 0; i < 4; i++) {
    const max = remaining - (4 - i);
    const val = Math.floor(Math.random() * (max + 1));
    vals.push(val);
    remaining -= val;
  }
  vals.push(remaining);
  // Shuffle
  for (let i = vals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [vals[i], vals[j]] = [vals[j], vals[i]];
  }
  return { A: vals[0], B: vals[1], C: vals[2], D: vals[3], E: vals[4] };
}

const Question6 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [teamAllocations, setTeamAllocations] = useState(
    teams.map(() => ({ A: '', B: '', C: '', D: '', E: '' }))
  );
  const [errors, setErrors] = useState(Array(teams.length).fill(''));

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerStarted, timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const getTotalFunds = (team) => BASE_FUNDS + (team.points || 0) * POINTS_MULTIPLIER;

  const handleAllocationChange = (teamIdx, potLetter, value) => {
    let val = value.replace(/[^0-9]/g, '');
    if (val.length > 3) val = val.slice(0, 3);
    if (val !== '' && (parseInt(val) < 0 || parseInt(val) > 100)) return;
    setTeamAllocations(prev => {
      const updated = [...prev];
      updated[teamIdx] = { ...updated[teamIdx], [potLetter]: val };
      return updated;
    });
  };

  const getTotalPercent = (alloc) => {
    return pots.reduce((sum, pot) => sum + (parseInt(alloc[pot.letter]) || 0), 0);
  };

  const handleSubmit = () => {
    let hasError = false;
    const newErrors = teamAllocations.map((alloc, idx) => {
      const total = getTotalPercent(alloc);
      if (total !== 100) {
        hasError = true;
        return `Total must be 100% (currently ${total}%)`;
      }
      return '';
    });
    setErrors(newErrors);
    if (!hasError) {
      if (typeof onNextQuestion === 'function') {
        onNextQuestion(teamAllocations);
      }
    }
  };

  const randomizeAll = () => {
    setTeamAllocations(teams.map(() => randomAllocation()));
  };

  return (
    <>
      <QuestionHeader />
      <div className="min-h-screen w-screen bg-[#0D0021] relative overflow-x-hidden font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white block p-0">
        {/* Floating Planets - use fq- prefixed classes from index.css */}
        <img src={PLANET_EARTH} alt="Earth" className="fq-planet fq-planet-earth" />
        <img src={PLANET_MOON} alt="Moon" className="fq-planet fq-planet-moon" />
        <img src={PLANET_MARS} alt="Mars" className="fq-planet fq-planet-mars" />
        {/* Top Bar Row */}
        <div className="bg-[#0D0021] pt-12 w-screen max-w-none m-0 flex flex-row items-center justify-center gap-12 z-[5] relative left-0">
          <div className="flex items-center gap-2 bg-[#1F0149] border-2 border-white rounded px-[10px] py-1.5 pr-[18px] text-[1.1rem] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white">
            <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="w-[22px] h-[22px] mr-1.5" />
            <span className="text-white font-inherit text-[1.1rem] tracking-wide">3 points</span>
          </div>
          <div className="text-[2.3rem] text-[#FF9524] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] tracking-[2px] [text-shadow:0_2px_0_#000,0_0_8px_rgba(255,149,36,0.67)] font-bold text-center mx-6">
            GRAND FINALE
          </div>
          <div className="relative inline-block min-w-[120px] h-16">
            {!timerStarted ? (
              <button onClick={startTimer} className="min-w-0 w-40 h-10 flex items-center justify-center bg-[#E1551D] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-0 py-0 px-4 transition-[box-shadow,border,opacity] duration-180 cursor-pointer outline-none relative border-none text-[1.3rem]">
                <span className="text-[1.3rem] tracking-[2px] [text-shadow:0_2px_0_rgba(0,0,0,0.67)] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white flex items-center">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="w-8 h-8 ml-2.5 mr-0 pointer-events-none inline-block align-middle" />
              </button>
            ) : (
              <div className="min-w-0 w-40 h-10 flex items-center justify-center bg-[#E1551D] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-0 py-0 px-4 opacity-70 cursor-default relative border-none text-[1.3rem]">
                <span className="text-[1.3rem] tracking-[2px] [text-shadow:0_2px_0_rgba(0,0,0,0.67)] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white flex items-center">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="w-8 h-8 ml-2.5 mr-0 pointer-events-none inline-block align-middle" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full max-w-[900px] mx-auto flex flex-col items-center">
          {/* Story Card */}
          <div className="bg-[#1C0032] rounded-[10px] mx-8 mt-8 shadow-[0_2px_0_rgba(0,0,0,0.5)] border-2 border-white/33 w-[calc(100%-64px)] max-w-[800px] z-[2] relative pb-6">
            <div className="flex flex-row items-center justify-between h-8 px-4 text-white text-[1.3rem] opacity-70 tracking-[2px] border-b-2 border-white/33">
              <span className="text-[1.5rem] opacity-70 tracking-[2px]">&hellip;</span>
              <span className="text-[1.5rem] opacity-70 cursor-default">&#10005;</span>
            </div>
            <div className="font-['Montserrat',Arial,sans-serif] text-[1.15rem] text-white leading-[2.1] text-center pt-8 px-8 font-medium">
              Zara just got <b>extra money from her family on Earth</b>.<br />
              She wants to <b>grow her net worth over the next <span className="text-[#CA70E3] font-bold">7 years</span></b> and you need to help her.<br /><br />
              <span className="text-[#CA70E3] font-bold">The team with the highest net worth wins!</span><br /><br />
              <span className="text-white font-bold">Use your team's score from earlier as your starting amount.</span>
            </div>
          </div>
          <hr className="border-none border-t-2 border-[#39205A] my-12 w-full" />
          {/* Task/Goal Section */}
          <div className="font-['Montserrat',Arial,sans-serif] text-xl text-white text-center mb-8">
            <span className="font-['Press_Start_2P','VT323','Consolas',monospace] text-white text-[1.1rem] font-bold tracking-[2px] mr-1.5">TASK</span> - Allocate your team's funds across these pots. You can split your money however you like, but the total must add up to 100%.
            <br /><br />
            <span className="italic text-[#CA70E3] text-[1.1rem]">Choose wisely - surprises are coming over the next 7 years!</span>
          </div>
          {/* Pots Display */}
          <div className="flex flex-wrap justify-center gap-8 my-8 mb-10 z-[2]">
            {pots.map((pot, idx) => (
              <div
                key={pot.letter}
                className={`bg-[#1C0032] border-[3px] rounded-[18px] shadow-[0_4px_0_rgba(0,0,0,0.5)] w-[210px] min-h-[220px] flex flex-col items-center py-6 pt-6 pb-[18px] px-4 relative transition-[transform,box-shadow,border-color,background] duration-130 hover:scale-[1.04] hover:-rotate-2 hover:shadow-[0_8px_24px_rgba(255,212,59,0.27)] hover:border-[#CA70E3] ${idx === 0 ? 'border-[#FFD43B] bg-gradient-to-br from-[#2d1a4d] to-[#FFD43B]/13' : idx === 1 ? 'border-[#FF9524] bg-gradient-to-br from-[#2d1a4d] to-[#FF9524]/13' : idx === 2 ? 'border-[#CA70E3] bg-gradient-to-br from-[#2d1a4d] to-[#CA70E3]/13' : idx === 3 ? 'border-[#4DD7FF] bg-gradient-to-br from-[#2d1a4d] to-[#4DD7FF]/13' : 'border-[#E1551D] bg-gradient-to-br from-[#2d1a4d] to-[#E1551D]/13'}`}
              >
                <img src={potIcon} alt="Pot" className="fq-choice-pie w-[54px] h-[54px] mb-3" />
                <div className={`font-['Press_Start_2P',monospace] text-center mb-2.5 text-[1.13rem] tracking-wide [text-shadow:2px_2px_0_#000,0_0_8px_rgba(0,0,0,0.67)] leading-snug ${idx === 0 ? 'text-[#FFD43B]' : idx === 1 ? 'text-[#FF9524]' : idx === 2 ? 'text-[#CA70E3]' : idx === 3 ? 'text-[#4DD7FF]' : 'text-[#E1551D]'}`}>{pot.name}</div>
                <div className="font-['Montserrat',Arial,sans-serif] text-white text-[1.05rem] text-center opacity-95 [text-shadow:1px_1px_0_#000,0_0_6px_rgba(0,0,0,0.67)] leading-normal mt-1">{pot.description}</div>
              </div>
            ))}
          </div>
          <hr className="border-none border-t-2 border-[#39205A] my-12 w-full" />
          {/* Team Allocations */}
          <div className="w-full max-w-[800px] mx-auto mb-8">
            <div className="font-['Montserrat',Arial,sans-serif] text-xl font-semibold text-white mb-4 text-center">
              Allocate your funds (total must be 100%)
            </div>
            {DEV_MODE && (
              <button className="mx-auto mb-[18px] block w-[220px] bg-[#FFD43B] text-[#1C0032] border-[3px] border-[#CA70E3] rounded-[14px] font-['Press_Start_2P',monospace] text-[1.08rem] py-3.5 cursor-pointer shadow-[0_4px_0_rgba(202,112,227,0.27),0_0_8px_rgba(255,212,59,0.33)] tracking-wide [text-shadow:1px_1px_0_rgba(255,255,255,0.5),0_0_6px_rgba(255,255,255,0.25)] transition-[background,color,border,transform,box-shadow] duration-120 hover:not(:disabled):bg-[#CA70E3] hover:not(:disabled):text-[#FFD43B] hover:not(:disabled):border-[#FFD43B] hover:not(:disabled):scale-[1.04] hover:not(:disabled):shadow-[0_8px_24px_rgba(255,212,59,0.27)] disabled:bg-[#ccc] disabled:text-[#888] disabled:border-[#aaa] disabled:cursor-not-allowed disabled:shadow-none" onClick={randomizeAll}>
                Randomize All (DEV)
              </button>
            )}
            <div className="flex flex-row gap-8 justify-center items-start mb-8 max-md:flex-col max-md:gap-6">
              {teams.map((team, teamIdx) => {
                const alloc = teamAllocations[teamIdx];
                const total = getTotalPercent(alloc);
                const funds = getTotalFunds(team);
                return (
                  <div key={team.name} className="flex flex-col items-stretch min-w-[320px] max-w-[420px] bg-[#1C0032] border-4 border-[#FFD43B] rounded-[18px] pb-[18px] shadow-[0_6px_0_rgba(0,0,0,0.5)] max-md:w-[95vw] max-md:min-w-0 max-md:max-w-[400px]">
                    <div className="font-['Press_Start_2P',monospace] text-[#FFD43B] text-[1.05rem] mb-0 text-center break-words [text-shadow:2px_2px_0_#000,0_0_8px_rgba(0,0,0,0.67)] bg-[#2D0245] border-b-[3px] border-[#FFD43B] rounded-t-[14px] py-3.5 pb-2">
                      {teamIdx + 1}. {team.name}
                    </div>
                    <div className="flex flex-col gap-0 w-full py-2.5 px-[18px] pt-2.5">
                      {pots.map((pot) => (
                        <div key={pot.letter} className="grid grid-cols-[44px_1.5fr_0.7fr_0.6fr_1fr] items-center bg-[rgba(46,2,69,0.06)] border-b-[1.5px] border-[#FFD43B]/27 py-3 pt-3 pb-2.5 min-w-[180px] min-h-[54px] relative overflow-hidden last:border-b-0 max-md:min-w-0 max-md:w-full max-md:grid-cols-[32px_1.5fr_1fr_1fr_1.2fr]">
                          <span className="w-8 h-8 mx-auto [image-rendering:pixelated]">{pot.icon}</span>
                          <span className="font-['Montserrat',monospace] text-left ml-2 text-[0.92rem] [text-shadow:1px_1px_0_#000,0_0_6px_rgba(0,0,0,0.67)] leading-tight" style={{ color: pot.color }}>{pot.name}</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={alloc[pot.letter]}
                            onChange={e => handleAllocationChange(teamIdx, pot.letter, e.target.value)}
                            className="w-10 text-[1.25rem] font-bold border-none bg-white/20 text-[#1C0032] font-['Press_Start_2P',monospace] py-2 text-center outline-none rounded-[7px] mx-2 transition-[background,box-shadow] duration-150 shadow-[0_1px_4px_rgba(0,0,0,0.13)] tracking-wide focus:bg-[#FFD43B]/13 focus:shadow-[0_0_0_2px_rgba(255,212,59,0.53)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
                          />
                          <span className="text-[#FFD43B] font-['Press_Start_2P',monospace] text-[1.1rem] ml-1 mr-0">%</span>
                          <span className="text-[#CA70E3] font-['Montserrat',Arial,sans-serif] text-[0.92rem] ml-1 [text-shadow:1px_1px_0_#000,0_0_6px_rgba(0,0,0,0.67)] text-right break-all max-w-[80px] overflow-hidden whitespace-nowrap text-ellipsis inline-block">
                            (£{((parseInt(alloc[pot.letter]) || 0) * funds / 100).toLocaleString()})
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className={`font-['Press_Start_2P',monospace] text-[#FFD43B] text-[1.05rem] mt-3 mb-0.5 text-center ${total !== 100 ? 'text-[#E1551D] [text-shadow:0_0_6px_rgba(225,85,29,0.27)]' : ''}`}>Total: {total}%</div>
                    {errors[teamIdx] && <div className="text-[#E1551D] font-['Press_Start_2P',monospace] text-[1.05rem] mt-0.5 text-center">{errors[teamIdx]}</div>}
                  </div>
                );
              })}
            </div>
            <button
              className="mx-auto mt-8 block w-[200px] bg-[#FFD43B] text-[#1C0032] border-[3px] border-[#CA70E3] rounded-[14px] font-['Press_Start_2P',monospace] text-[1.15rem] py-4 cursor-pointer shadow-[0_4px_0_rgba(202,112,227,0.27),0_0_8px_rgba(255,212,59,0.33)] tracking-wide [text-shadow:1px_1px_0_rgba(255,255,255,0.5),0_0_6px_rgba(255,255,255,0.25)] transition-[background,color,border,transform,box-shadow] duration-180 hover:not(:disabled):bg-[#CA70E3] hover:not(:disabled):text-[#FFD43B] hover:not(:disabled):border-[#FFD43B] hover:not(:disabled):scale-[1.04] hover:not(:disabled):shadow-[0_8px_24px_rgba(255,212,59,0.27)] active:not(:disabled):bg-[#FF9524] active:not(:disabled):text-white active:not(:disabled):border-[#FF9524] active:not(:disabled):scale-[0.98] disabled:bg-[#ccc] disabled:text-[#888] disabled:border-[#aaa] disabled:cursor-not-allowed disabled:shadow-none"
              onClick={handleSubmit}
              disabled={teamAllocations.some(alloc => getTotalPercent(alloc) !== 100)}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Question6;
