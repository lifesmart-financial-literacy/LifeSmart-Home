import React, { useState, useEffect, useRef } from 'react';
import QuestionHeader from './QuestionHeader';

const Question2 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const whyRef = useRef(null);

  const correctAnswer = 'A';

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerStarted, timer]);

  const minutes = timerStarted ? Math.floor(timer / 60) : 3;
  const seconds = timerStarted ? timer % 60 : 0;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
      setTimer(180);
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
    // Scoring: 3 points for A, 2 for B, 1 for C, 0 for D/E
    const pointsArray = teamAnswers.map(answer => {
      if (answer === 'A') return 3;
      if (answer === 'B') return 2;
      if (answer === 'C') return 1;
      return 0;
    });
    onAwardPoints(pointsArray);
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <>
      <QuestionHeader />
      {/* Topbar */}
      <div className="bg-[#0D0021] pt-12 w-screen flex flex-row items-center justify-center gap-12 z-[5] relative">
        <div className="flex items-center gap-2 bg-[#1F0149] border-2 border-white rounded px-[10px] py-1.5 pr-[18px] text-[1.1rem] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white">
          <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="w-[22px] h-[22px] mr-1.5" />
          <span className="text-white font-inherit text-[1.1rem] tracking-wide">3 points</span>
        </div>
        <div className="text-[2.3rem] text-[#FF9524] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] tracking-[2px] [text-shadow:0_2px_0_#000,0_0_8px_rgba(255,149,36,0.67)] font-bold text-center mx-6">
          CHALLENGE 2
        </div>
        <div className="relative inline-block min-w-[120px] h-16">
          <button
            className="w-[260px] h-[60px] flex items-center justify-center bg-[#E1551D] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-0 p-0 transition-[box-shadow,border,opacity] duration-180 outline-none relative disabled:opacity-70 disabled:cursor-default hover:not(:disabled):shadow-[0_12px_48px_rgba(255,149,36,0.8)] hover:not(:disabled):border-[#FF9524]"
            aria-label="Start timer"
            onClick={() => { if (!timerStarted) startTimer(); }}
            style={{ cursor: timerStarted ? 'default' : 'pointer' }}
            disabled={timerStarted}
          >
            <div className="bg-none rounded-none shadow-none min-w-0 min-h-0 text-[1.8rem] pr-8 text-white font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] flex items-center justify-center">
              <span className="text-[1.8rem] tracking-[2px] [text-shadow:0_2px_0_rgba(0,0,0,0.67)]">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
            </div>
            <img
              src="/financeQuest/icons/8bitAlarm.png"
              alt="timer"
              className="static w-20 h-20 ml-0 mr-0 pointer-events-none"
            />
          </button>
        </div>
      </div>
      <div className="min-h-screen w-screen bg-[#0D0021] relative overflow-x-hidden font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white flex items-start justify-center p-0">
        <div className="my-12 mb-8 pb-8 w-[98vw] z-[2] relative flex flex-col items-center">
          {/* Story Section */}
          <div className="bg-[rgba(44,19,70,0.98)] rounded-[18px] mx-8 mt-8 shadow-[0_4px_32px_rgba(0,0,0,0.4)] border-none w-[calc(100%-64px)] z-[2] p-8 pt-9 pb-8">
            <div className="flex flex-row items-center justify-between h-8 pb-3 text-white text-[1.3rem] opacity-70 tracking-[2px] border-none">
              <span className="text-[1.2rem] opacity-50 tracking-[2px]">&hellip;</span>
              <span className="text-[1.2rem] opacity-50 tracking-[2px]">&#10005;</span>
            </div>
            <div className="font-['Montserrat',Arial,sans-serif] text-[1.25rem] text-white leading-[2.1] text-center mb-8">
              <span className="text-white text-[1.25rem] font-inherit font-bold">Two months later, Zara lands her <b>first job</b> as a junior rover-tech. She earns <b>4,000 Mars Credits (MC) per month</b> after the mandatory "Oxygen-tax" has already been taken out.</span><br /><br />
              Below are her planned <b>monthly costs (all in MC):</b>
              <div className="mt-8 mx-auto w-full max-w-[700px] flex justify-center bg-none rounded-2xl p-0">
                <table className="w-full border-separate border-spacing-0 bg-[rgba(60,30,90,0.98)] rounded-2xl text-white font-['Montserrat',Arial,sans-serif] text-[1.1rem] shadow-[0_2px_16px_rgba(0,0,0,0.25)] overflow-hidden">
                  <thead>
                    <tr>
                      <th className="p-[18px] text-left border-b-2 border-white/20 font-bold text-[1.15rem]">Category</th>
                      <th className="p-[18px] text-left border-b-2 border-white/20 font-bold text-[1.15rem]">Description</th>
                      <th className="p-[18px] text-left border-b-2 border-white/20 font-bold text-[1.15rem]">Cost (MC)</th>
                      <th className="p-[18px] text-left border-b-2 border-white/20 font-bold text-[1.15rem]">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-[18px] border-b border-white/10 font-bold">Habitat pod rent</td><td className="p-[18px] border-b border-white/10">Includes air-recycling fee</td><td className="p-[18px] border-b border-white/10">1150</td><td className="p-[18px] border-b border-white/10">Need</td></tr>
                    <tr><td className="p-[18px] border-b border-white/10 font-bold">Life Support</td><td className="p-[18px] border-b border-white/10">Food, water, basic utilities</td><td className="p-[18px] border-b border-white/10">900</td><td className="p-[18px] border-b border-white/10">Need</td></tr>
                    <tr><td className="p-[18px] border-b border-white/10 font-bold">Colony Data plan</td><td className="p-[18px] border-b border-white/10">Communicator & holo-net</td><td className="p-[18px] border-b border-white/10">210</td><td className="p-[18px] border-b border-white/10">Want</td></tr>
                    <tr><td className="p-[18px] border-b border-white/10 font-bold">Exploration & Fun</td><td className="p-[18px] border-b border-white/10">Holo-games subscription, eating out with friends</td><td className="p-[18px] border-b border-white/10">580</td><td className="p-[18px] border-b border-white/10">Want</td></tr>
                    <tr><td className="p-[18px] font-bold">Safety Fund auto-transfer</td><td className="p-[18px]">Emergency Savings (20% of income target)</td><td className="p-[18px]">?</td><td className="p-[18px]">Savings</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Question Section */}
          <div className="mt-8 text-center">
            <span className="text-[1.3rem] text-white font-inherit font-bold tracking-wide">How much money does she have <span style={{ color: '#A084F3' }}>left over</span> after all her expenses - including the safety fund?</span>
          </div>
          {/* Choices Section */}
          <div className="flex flex-row justify-center gap-6 mt-9 mx-auto w-full max-w-[900px] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif]">
            <div className={`flex items-center justify-center bg-[#2B1842] border border-[#A084F3] rounded-none min-w-[170px] max-w-[220px] h-14 mr-[18px] pr-[18px] font-['Montserrat',Arial,sans-serif] text-white text-[1.15rem] shadow-none transition-[border,box-shadow,transform] duration-180 text-center ${showResults ? '!bg-[#0D4C43] !border-[#4AC47E] [&_span:first-child]:!bg-[#4AC47E] [&_span:first-child]:!border-[#0D4C43]' : ''} hover:border-[#FF9524] hover:shadow-[0_0_0_2px_rgba(255,149,36,0.67)] hover:scale-[1.04] hover:z-[2]`}>
              <span className="w-8 h-8 rounded-full bg-[#A02B6C] text-white flex items-center justify-center mr-3.5 text-[1.15rem] font-bold shadow-none border border-[#222]"><span style={{ fontFamily: 'Thertole, sans-serif' }}>A</span></span>
              <span className="text-white font-['Montserrat',Arial,sans-serif] text-[1.15rem] ml-0.5 font-bold text-center">120 MC</span>
            </div>
            <div className="flex items-center justify-center bg-[#2B1842] border border-[#A084F3] rounded-none min-w-[170px] max-w-[220px] h-14 mr-[18px] pr-[18px] font-['Montserrat',Arial,sans-serif] text-white text-[1.15rem] shadow-none transition-[border,box-shadow,transform] duration-180 text-center hover:border-[#FF9524] hover:shadow-[0_0_0_2px_rgba(255,149,36,0.67)] hover:scale-[1.04] hover:z-[2]">
              <span className="w-8 h-8 rounded-full bg-[#A02B6C] text-white flex items-center justify-center mr-3.5 text-[1.15rem] font-bold shadow-none border border-[#222]"><span style={{ fontFamily: 'Thertole, sans-serif' }}>B</span></span>
              <span className="text-white font-['Montserrat',Arial,sans-serif] text-[1.15rem] ml-0.5 font-bold text-center">200 MC</span>
            </div>
            <div className="flex items-center justify-center bg-[#2B1842] border border-[#A084F3] rounded-none min-w-[170px] max-w-[220px] h-14 mr-[18px] pr-[18px] font-['Montserrat',Arial,sans-serif] text-white text-[1.15rem] shadow-none transition-[border,box-shadow,transform] duration-180 text-center hover:border-[#FF9524] hover:shadow-[0_0_0_2px_rgba(255,149,36,0.67)] hover:scale-[1.04] hover:z-[2]">
              <span className="w-8 h-8 rounded-full bg-[#A02B6C] text-white flex items-center justify-center mr-3.5 text-[1.15rem] font-bold shadow-none border border-[#222]"><span style={{ fontFamily: 'Thertole, sans-serif' }}>C</span></span>
              <span className="text-white font-['Montserrat',Arial,sans-serif] text-[1.15rem] ml-0.5 font-bold text-center">360 MC</span>
            </div>
            <div className="flex items-center justify-center bg-[#2B1842] border border-[#A084F3] rounded-none min-w-[170px] max-w-[220px] h-14 mr-[18px] pr-[18px] font-['Montserrat',Arial,sans-serif] text-white text-[1.15rem] shadow-none transition-[border,box-shadow,transform] duration-180 text-center hover:border-[#FF9524] hover:shadow-[0_0_0_2px_rgba(255,149,36,0.67)] hover:scale-[1.04] hover:z-[2]">
              <span className="w-8 h-8 rounded-full bg-[#A02B6C] text-white flex items-center justify-center mr-3.5 text-[1.15rem] font-bold shadow-none border border-[#222]"><span style={{ fontFamily: 'Thertole, sans-serif' }}>D</span></span>
              <span className="text-white font-['Montserrat',Arial,sans-serif] text-[1.15rem] ml-0.5 font-bold text-center">800 MC</span>
            </div>
            <div className="flex items-center justify-center bg-[#2B1842] border border-[#A084F3] rounded-none min-w-[170px] max-w-[220px] h-14 pr-[18px] font-['Montserrat',Arial,sans-serif] text-white text-[1.15rem] shadow-none transition-[border,box-shadow,transform] duration-180 text-center hover:border-[#FF9524] hover:shadow-[0_0_0_2px_rgba(255,149,36,0.67)] hover:scale-[1.04] hover:z-[2]">
              <span className="w-8 h-8 rounded-full bg-[#A02B6C] text-white flex items-center justify-center mr-3.5 text-[1.15rem] font-bold shadow-none border border-[#222]"><span style={{ fontFamily: 'Thertole, sans-serif' }}>E</span></span>
              <span className="text-white font-['Montserrat',Arial,sans-serif] text-[1.15rem] ml-0.5 font-bold text-center">3640 MC</span>
            </div>
          </div>
          {showResults && (
            <button className="block w-full max-w-[520px] mx-auto mt-8 py-6 bg-[#33005F] text-white border-2 border-white rounded-xl font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-base tracking-[2px] uppercase text-center [text-shadow:0_2px_0_rgba(255,255,255,0.5)] cursor-pointer transition-[background,color,border] duration-180 hover:bg-[#CA70E3] hover:text-white hover:border-white" onClick={() => whyRef.current && whyRef.current.scrollIntoView({ behavior: 'smooth' })}>
              WANT TO KNOW WHY?
            </button>
          )}
          {/* Team Answer Section */}
          <div className="mt-12 text-center w-full font-['Montserrat',Arial,sans-serif]">
            <span className="text-[1.7rem] text-white font-inherit font-bold tracking-wide">Select your <span className="text-[#CA70E3] font-inherit font-bold">answers</span></span>
            <div className="flex flex-row justify-center gap-12 mt-8 flex-wrap">
              {teams.map((team, idx) => (
                <div className="flex flex-col items-center py-[18px] px-6 min-w-[180px] max-w-[220px] box-border" key={team.name}>
                  <span className="font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-[1.1rem] text-white font-bold mb-4 tracking-wide max-w-[180px] text-center whitespace-nowrap overflow-hidden text-ellipsis block">{idx + 1}. <b>{team.name}</b></span>
                  {showResults ? (
                    <div className={`w-16 h-16 flex items-center justify-center text-[2rem] font-bold text-white rounded-2xl my-3 mx-auto shadow-[0_4px_16px_rgba(0,0,0,0.25)] tracking-wide ${teamAnswers[idx] === correctAnswer ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}>{teamAnswers[idx]}</div>
                  ) : (
                    <select
                      value={teamAnswers[idx]}
                      onChange={e => handleTeamAnswerChange(idx, e.target.value)}
                      className="font-['Montserrat',Arial,sans-serif] text-[1.1rem] bg-[#1F0149] text-white border-2 border-white rounded-lg py-2.5 px-[18px] mt-1 outline-none shadow-[0_2px_0_rgba(0,0,0,0.5)] transition-[border,box-shadow] duration-200 cursor-pointer focus:border-[#FF9524] focus:shadow-[0_0_0_2px_rgba(255,149,36,0.67)] hover:border-[#FF9524] hover:shadow-[0_0_0_2px_rgba(255,149,36,0.67)]"
                    >
                      <option value="">Select one</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
            {!showResults ? (
              <button className="mx-auto mt-10 block w-[220px] max-w-[90vw] bg-[#FF9524] text-[#1C0032] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-[1.3rem] border-4 border-white rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.5),0_0_0_4px_#C77DFF] py-[18px] pb-3.5 tracking-[2px] cursor-pointer transition-[background,color,border,box-shadow] duration-200 [text-shadow:0_2px_0_rgba(255,255,255,0.5)] disabled:bg-[#888] disabled:text-white disabled:border-[#ccc] disabled:cursor-not-allowed disabled:shadow-none disabled:[text-shadow:none] hover:not(:disabled):bg-[#C77DFF] hover:not(:disabled):text-white hover:not(:disabled):border-[#FF9524] hover:not(:disabled):shadow-[0_8px_24px_rgba(255,149,36,0.67),0_0_0_4px_#C77DFF]" onClick={submitAnswers} disabled={teamAnswers.some(a => !a)}>SUBMIT</button>
            ) : (
              <button className="mx-auto mt-10 block w-[220px] max-w-[90vw] bg-[#FF9524] text-[#1C0032] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-[1.3rem] border-4 border-white rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.5),0_0_0_4px_#C77DFF] py-[18px] pb-3.5 tracking-[2px] cursor-pointer transition-[background,color,border,box-shadow] duration-200 [text-shadow:0_2px_0_rgba(255,255,255,0.5)] hover:bg-[#C77DFF] hover:text-white hover:border-[#FF9524] hover:shadow-[0_8px_24px_rgba(255,149,36,0.67),0_0_0_4px_#C77DFF]" onClick={onNextQuestion}>NEXT QUESTION</button>
            )}
          </div>
          {showResults && (
            <div className="mt-12 text-left w-full border-t border-[rgba(248,248,248,0.15)] pt-8 font-['Montserrat',Arial,sans-serif]" ref={whyRef}>
              <div className="font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white text-[1.2rem] uppercase mb-[18px] ml-12 tracking-wide">KEY CALCULATIONS</div>
              <div className="text-white text-[1.1rem] ml-12 text-left font-['Montserrat',Arial,sans-serif]">
                <ul style={{ marginLeft: 0, paddingLeft: 24 }}>
                  <li>
                    <strong>Safety Fund: 20% of 4,000 MC = 800 MC</strong>
                  </li>
                  <li>
                    <strong>Total Costs: 1,150 + 900 + 210 + 580 + 800 = 3,880 MC</strong>
                  </li>
                  <li>
                    <strong>Leftover: 4,000 - 3,880 = 120 MC</strong>
                  </li>
                </ul>
                <p style={{ marginTop: 18 }}>
                  The correct answer is <strong>120 MC</strong> (Option A). This is the money left after all expenses, including the safety fund auto-transfer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Question2;
